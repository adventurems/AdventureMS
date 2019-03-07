/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package constants;

import client.MapleCharacter;

/**
 *
 * @author Drago
 */
public class LinguaConstants {
	// Portugues
    public static String CPQAzul;
    public static String CPQErro;
    public static String CPQEntrada;
    public static String CPQEscolha;
    public static String CPQVermelho;
    public static String CPQPlayerExit;
    public static String CPQEntradaLobby;
    public static String CPQInicioEscolha;
    public static String CPQTempoExtendido;
    public static String CPQLiderNaoEncontrado;
    public static String CPQInicioEscolhaEmEscolha;

    public static LinguaConstants Linguas(MapleCharacter chr) {
        if (chr.getLingua() == 0) {
            LinguaConstants.CPQAzul = "Maple Azul";
            LinguaConstants.CPQVermelho = "Maple Vermelho";
            LinguaConstants.CPQTempoExtendido = "O tempo foi estendido.";
            LinguaConstants.CPQPlayerExit = " deixou o Carnaval de Monstros.";
            LinguaConstants.CPQErro = "Ocorreu um problema. Favor recriar a sala.";
            LinguaConstants.CPQLiderNaoEncontrado = "N�o foi poss�vel encontrar o Lider.";
            LinguaConstants.CPQInicioEscolha = "Inscreva-se no Festival de Monstros!\\r\\n";            
            LinguaConstants.CPQInicioEscolhaEmEscolha = "O grupo esta respondendo um desafio no momento.";
            LinguaConstants.CPQEscolha = "N�o foi poss�vel encontrar um grupo nesta sala.\\r\\nProvavelmente o grupo foi desfeito dentro da sala!";
            LinguaConstants.CPQEntradaLobby = "[CPQ MapleStorySA] Agora voc� ir� receber desafios de outros grupos. Se voc� n�o aceitar um desafio em 3 minutos, voc� ser� levado para fora.";
            LinguaConstants.CPQEntrada = "Voc� pode selecionar \"Invocar Monstros\", \"Habilidade\", ou \"Protetor\" como sua t�tica durante o Carnaval dos Monstros. Use Tab a F1~F12 para acesso r�pido!";

            
            
        } else if (chr.getLingua() == 1) {
            LinguaConstants.CPQAzul = "Maple Azul";
            LinguaConstants.CPQVermelho = "Maple Rojo";
            LinguaConstants.CPQTempoExtendido = "El tiempo se ha ampliado.";
            LinguaConstants.CPQPlayerExit = " ha dejado el Carnaval de Monstruos.";
            LinguaConstants.CPQLiderNaoEncontrado = "No se pudo encontrar el Lider.";
            LinguaConstants.CPQInicioEscolha = "�Inscr�bete en el Festival de Monstruos!\\r\\n";
            LinguaConstants.CPQErro = "Se ha producido un problema. Por favor, volver a crear una sala.";
            LinguaConstants.CPQInicioEscolhaEmEscolha = "El grupo esta respondiendo un desaf�o en el momento.";
            LinguaConstants.CPQEscolha = "No se pudo encontrar un grupo en esta sala.\\r\\nProbablemente el grupo fue deshecho dentro de la sala!";
            LinguaConstants.CPQEntradaLobby = "[CPQ MapleStorySA] Ahora usted recibir� los retos de otros grupos. Si usted no acepta un desaf�o en 3 minutos, usted ser� llevado hacia fuera.";
            LinguaConstants.CPQEntrada = "Usted puede seleccionar \"Invocar Monstruos \", \"Habilidad \", o \"Protector \" como su t�ctica durante el Carnaval de los Monstruos. Utilice Tab y F1 ~ F12 para acceso r�pido!";

            
        } else if (chr.getLingua() == 2) {
            LinguaConstants.CPQAzul = "Maple Blue";
            LinguaConstants.CPQVermelho = "Maple Red";
            LinguaConstants.CPQPlayerExit = " left the Carnival of Monsters.";
            LinguaConstants.CPQTempoExtendido = "The time has been extended.";
            LinguaConstants.CPQLiderNaoEncontrado = "Could not find the Leader.";
            LinguaConstants.CPQErro = "There was a problem. Please re-create a room.";
            LinguaConstants.CPQInicioEscolha = "Sign up for the Monster Festival!\\r\\n";
            LinguaConstants.CPQInicioEscolhaEmEscolha = "The group is currently facing a challenge.";
            LinguaConstants.CPQEscolha = "We could not find a group in this room.\\r\\nProbably the group was scrapped inside the room!";
            LinguaConstants.CPQEntradaLobby = "[CPQ MapleStorySA] You will now receive challenges from other groups. If you do not accept a challenge within 3 minutes, you will be taken out.";
            LinguaConstants.CPQEntrada = "You can select \"Summon Monsters \", \"Ability \", or \"Protector \" as your tactic during the Monster Carnival. Use Tab and F1 ~ F12 for quick access!";
            
        }
        return null;
    }
}
