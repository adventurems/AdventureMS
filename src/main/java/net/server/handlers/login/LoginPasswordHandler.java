package net.server.handlers.login;

import client.Client;
import client.DefaultDates;
import config.YamlConfig;
import net.PacketHandler;
import net.packet.InPacket;
import net.server.Server;
import net.server.coordinator.session.Hwid;
import tools.BCrypt;
import tools.DatabaseConnection;
import tools.HexTool;
import tools.PacketCreator;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Calendar;

public final class LoginPasswordHandler implements PacketHandler {

    @Override
    public boolean validateState(Client c) {
        return !c.isLoggedIn();
    }

    private static String hashpwSHA512(String pwd) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        MessageDigest digester = MessageDigest.getInstance("SHA-512");
        digester.update(pwd.getBytes(StandardCharsets.UTF_8), 0, pwd.length());
        return HexTool.toHexString(digester.digest()).replace(" ", "").toLowerCase();
    }

    @Override
    public final void handlePacket(InPacket p, Client c) {
        String remoteHost = c.getRemoteAddress();
        if (remoteHost.contentEquals("null")) {
            c.sendPacket(PacketCreator.getLoginFailed(14));          // thanks Alchemist for noting remoteHost could be null
            return;
        }

        // AdventureMS Custom

        // Check if GMSERVER is true and validate IP
        if (YamlConfig.config.server.GMSERVER) {
            // Define a list of allowed IPs (you can modify this logic as needed)
            String[] allowedIps = {"76.121.7.141", "68.48.172.78", "24.247.188.67"}; // Allowed IPs, update as necessary
            boolean isValidIp = false;

            for (String allowedIp : allowedIps) {
                if (remoteHost.equals(allowedIp)) {
                    isValidIp = true;
                    break;
                }
            }

            if (!isValidIp) {
                c.sendPacket(PacketCreator.getLoginFailed(15)); // Custom failure code for invalid IP
                return;
            }
        }

        String login = p.readString();
        String pwd = p.readString();
        c.setAccountName(login);

        p.skip(6);   // localhost masked the initial part with zeroes...
        byte[] hwidNibbles = p.readBytes(4);
        Hwid hwid = new Hwid(HexTool.toCompactHexString(hwidNibbles));
        int loginok = c.login(login, pwd, hwid);

        // AdventureMS Custom
        if (YamlConfig.config.server.AUTOMATIC_REGISTER && loginok == 5) {
            try (Connection con = DatabaseConnection.getConnection(); // AdventureMS Custom - cashstorage
                 PreparedStatement ps = con.prepareStatement("INSERT INTO accounts (name, password, birthday, tempban, cashstorage) VALUES (?, ?, ?, ?, ?);", Statement.RETURN_GENERATED_KEYS)) { //Jayd: Added birthday, tempban
                ps.setString(1, login);
                ps.setString(2, YamlConfig.config.server.BCRYPT_MIGRATION ? BCrypt.hashpw(pwd, BCrypt.gensalt(12)) : hashpwSHA512(pwd));
                ps.setDate(3, Date.valueOf(DefaultDates.getBirthday()));
                ps.setTimestamp(4, Timestamp.valueOf(DefaultDates.getTempban()));
                ps.setInt(5, 16);
                ps.executeUpdate();

                try (ResultSet rs = ps.getGeneratedKeys()) {
                    rs.next();
                    c.setAccID(rs.getInt(1));
                }
            } catch (SQLException | NoSuchAlgorithmException | UnsupportedEncodingException e) {
                c.setAccID(-1);
                e.printStackTrace();
            } finally {
                loginok = c.login(login, pwd, hwid);
            }
        }

        if (YamlConfig.config.server.BCRYPT_MIGRATION && (loginok <= -10)) { // -10 means migration to bcrypt, -23 means TOS wasn't accepted
            try (Connection con = DatabaseConnection.getConnection();
                 PreparedStatement ps = con.prepareStatement("UPDATE accounts SET password = ? WHERE name = ?;")) {
                ps.setString(1, BCrypt.hashpw(pwd, BCrypt.gensalt(12)));
                ps.setString(2, login);
                ps.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                loginok = (loginok == -10) ? 0 : 23;
            }
        }

        if (c.hasBannedIP() || c.hasBannedMac()) {
            c.sendPacket(PacketCreator.getLoginFailed(3));
            return;
        }
        Calendar tempban = c.getTempBanCalendarFromDB();
        if (tempban != null) {
            if (tempban.getTimeInMillis() > Calendar.getInstance().getTimeInMillis()) {
                c.sendPacket(PacketCreator.getTempBan(tempban.getTimeInMillis(), c.getGReason()));
                return;
            }
        }
        if (loginok == 3) {
            c.sendPacket(PacketCreator.getPermBan(c.getGReason()));//crashes but idc :D
            return;
        } else if (loginok != 0) {
            c.sendPacket(PacketCreator.getLoginFailed(loginok));
            return;
        }
        if (c.finishLogin() == 0) {
            c.checkChar(c.getAccID());
            login(c);
        } else {
            c.sendPacket(PacketCreator.getLoginFailed(7));
        }
    }

    private static void login(Client c) {
        c.sendPacket(PacketCreator.getAuthSuccess(c));//why the fk did I do c.getAccountName()?
        Server.getInstance().registerLoginState(c);
    }
}