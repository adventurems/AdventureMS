package tools.mapletools;

import provider.wz.WZFiles;
import tools.Pair;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * @author RonanLana
 * <p>
 * This application gets info from the WZ.XML files regarding cash itemids then searches the drop data on the DB
 * after any NX (cash item) drops and reports them.
 * <p>
 * Estimated parse time: 2 minutes
 */
public class CashDropFetcher {
    private static final Path OUTPUT_FILE = ToolConstants.getOutputFile("cash_drop_report.txt");
    private static final Connection con = SimpleDatabaseConnection.getConnection();
    private static final int INITIAL_STRING_LENGTH = 50;
    private static final int ITEM_FILE_NAME_SIZE = 13;

    private static final Set<Integer> nxItems = new HashSet<>();
    private static final Set<Integer> nxDrops = new HashSet<>();

    private static PrintWriter printWriter = null;
    private static BufferedReader bufferedReader = null;

    private static byte status = 0;
    private static int currentItemid = 0;

    private static String getName(String token) {
        int i, j;
        char[] dest;
        String d;

        i = token.lastIndexOf("name");
        i = token.indexOf("\"", i) + 1; //lower bound of the string
        j = token.indexOf("\"", i);     //upper bound

        if (j < i) {
            return "0";           //node value containing 'name' in it's scope, cheap fix since we don't deal with strings anyway
        }

        dest = new char[INITIAL_STRING_LENGTH];
        token.getChars(i, j, dest, 0);

        d = new String(dest);
        return (d.trim());
    }

    private static String getValue(String token) {
        int i, j;
        char[] dest;
        String d;

        i = token.lastIndexOf("value");
        i = token.indexOf("\"", i) + 1; //lower bound of the string
        j = token.indexOf("\"", i);     //upper bound

        dest = new char[INITIAL_STRING_LENGTH];
        token.getChars(i, j, dest, 0);

        d = new String(dest);
        return (d.trim());
    }

    private static void forwardCursor(int st) {
        String line = null;

        try {
            while (status >= st && (line = bufferedReader.readLine()) != null) {
                simpleToken(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void simpleToken(String token) {
        if (token.contains("/imgdir")) {
            status -= 1;
        } else if (token.contains("imgdir")) {
            status += 1;
        }
    }


    private static void inspectEquipWzEntry() {
        String line = null;

        try {
            while ((line = bufferedReader.readLine()) != null) {
                translateEquipToken(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void translateEquipToken(String token) {
        if (token.contains("/imgdir")) {
            status -= 1;
        } else if (token.contains("imgdir")) {
            if (status == 1) {
                if (!getName(token).equals("info")) {
                    forwardCursor(status);
                }
            }

            status += 1;
        } else {
            if (status == 2) {
                String d = getName(token);

                if (d.equals("cash")) {
                    if (!getValue(token).equals("0")) {
                        nxItems.add(currentItemid);
                    }

                    forwardCursor(status);
                }
            }
        }
    }

    private static void inspectItemWzEntry() {
        String line = null;

        try {
            while ((line = bufferedReader.readLine()) != null) {
                translateItemToken(line);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void translateItemToken(String token) {
        if (token.contains("/imgdir")) {
            status -= 1;
        } else if (token.contains("imgdir")) {
            if (status == 1) {
                currentItemid = Integer.parseInt(getName(token));
            } else if (status == 2) {
                if (!getName(token).equals("info")) {
                    forwardCursor(status);
                }
            }

            status += 1;
        } else {
            if (status == 3) {
                String d = getName(token);

                if (d.equals("cash")) {
                    if (!getValue(token).equals("0")) {
                        nxItems.add(currentItemid);
                    }

                    forwardCursor(status);
                }
            }
        }
    }

    private static void printReportFileHeader() {
        printWriter.println(" # Report File autogenerated from the MapleCashDropFetcher feature by Ronan Lana.");
        printWriter.println(" # Generated data takes into account several data info from the underlying DB and the server-side WZ.xmls.");
        printWriter.println();
    }

    private static void listFiles(Path directoryName, ArrayList<Path> files) {
        // get all the files from a directory
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(directoryName)) {
            for (Path path : stream) {
                if (Files.isRegularFile(path)) {
                    files.add(path);
                } else if (Files.isDirectory(path)) {
                    listFiles(path, files);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static int getItemIdFromFilename(String name) {
        try {
            return Integer.parseInt(name.substring(0, name.indexOf('.')));
        } catch (Exception e) {
            return -1;
        }
    }

    private static String getDropTableName(boolean dropdata) {
        return (dropdata ? "drop_data" : "reactordrops");
    }

    private static String getDropElementName(boolean dropdata) {
        return (dropdata ? "dropperid" : "reactorid");
    }

    private static void filterNxDropsOnDB(boolean dropdata) throws SQLException {
        nxDrops.clear();

        PreparedStatement ps = con.prepareStatement("SELECT DISTINCT itemid FROM " + getDropTableName(dropdata));
        ResultSet rs = ps.executeQuery();

        while (rs.next()) {
            int itemid = rs.getInt("itemid");

            if (nxItems.contains(itemid)) {
                nxDrops.add(itemid);
            }
        }

        rs.close();
        ps.close();
    }

    private static List<Pair<Integer, Integer>> getNxDropsEntries(boolean dropdata) throws SQLException {
        List<Pair<Integer, Integer>> entries = new ArrayList<>();

        List<Integer> sortedNxDrops = new ArrayList<>(nxDrops);
        Collections.sort(sortedNxDrops);

        for (Integer nx : sortedNxDrops) {
            PreparedStatement ps = con.prepareStatement("SELECT " + getDropElementName(dropdata) + " FROM " + getDropTableName(dropdata) + " WHERE itemid = ?");
            ps.setInt(1, nx);

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                entries.add(new Pair<>(nx, rs.getInt(getDropElementName(dropdata))));
            }

            rs.close();
            ps.close();
        }

        return entries;
    }

    private static void reportNxDropResults(boolean dropdata) throws SQLException {
        filterNxDropsOnDB(dropdata);

        if (!nxDrops.isEmpty()) {
            List<Pair<Integer, Integer>> nxEntries = getNxDropsEntries(dropdata);

            printWriter.println("NX DROPS ON " + getDropTableName(dropdata));
            for (Pair<Integer, Integer> nx : nxEntries) {
                printWriter.println(nx.left + " : " + nx.right);
            }
            printWriter.println("\n\n\n");
        }
    }

    private static void reportNxDropData() {
        try (con; PrintWriter pw = new PrintWriter(Files.newOutputStream(OUTPUT_FILE))) {
            System.out.println("Reading Character.wz ...");
            ArrayList<Path> files = new ArrayList<>();
            listFiles(WZFiles.CHARACTER.getFile(), files);

            for (Path path : files) {
                // System.out.println("Parsing " + f.getAbsolutePath());
                int itemid = getItemIdFromFilename(path.getFileName().toString());
                if (itemid < 0) {
                    continue;
                }

                bufferedReader = Files.newBufferedReader(path);

                currentItemid = itemid;
                inspectEquipWzEntry();

                bufferedReader.close();
            }

            System.out.println("Reading Item.wz ...");
            files = new ArrayList<>();
            listFiles(WZFiles.ITEM.getFile(), files);

            for (Path path : files) {
                // System.out.println("Parsing " + f.getAbsolutePath());
                bufferedReader = Files.newBufferedReader(path);

                if (path.getFileName().toString().length() <= ITEM_FILE_NAME_SIZE) {
                    inspectItemWzEntry();
                } else { // pet file structure is similar to equips, maybe there are other item-types
                         // following this behaviour?
                    int itemid = getItemIdFromFilename(path.getFileName().toString());
                    if (itemid < 0) {
                        continue;
                    }

                    currentItemid = itemid;
                    inspectEquipWzEntry();
                }

                bufferedReader.close();
            }

            System.out.println("Reporting results...");

            // report suspects of missing quest drop data, as well as those drop data that
            // may have incorrect questids.
            printWriter = pw;
            printReportFileHeader();

            reportNxDropResults(true);
            reportNxDropResults(false);

            /*
             * printWriter.println("NX LIST"); // list of all cash items found for(Integer
             * nx : nxItems) { printWriter.println(nx); }
             */

            System.out.println("Done!");
        } catch (SQLException e) {
            System.out.println("Warning: Could not establish connection to database to report quest data.");
            System.out.println(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        reportNxDropData();
    }
}
