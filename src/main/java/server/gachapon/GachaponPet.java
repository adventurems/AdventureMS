package server.gachapon;

/**
 * @author Alan (SharpAceX) - gachapon source classes stub & pirate equipment
 * @author Ronan - parsed MapleSEA loots
 * <p>
 * MapleSEA-like loots thanks to AyumiLove - src: https://ayumilovemaple.wordpress.com/maplestory-gachapon-guide/
 */

public class GachaponPet extends GachaponItems {

    @Override
    public int[] getCommonItems()
    {
        return new int[]
        {
            // Pets
            5000002, 5000003, 5000004, 5000006, 5000007, 5000008, 5000009, 5000010, 5000011, 5000013,
            5000014, 5000017, 5000022, 5000023, 5000024, 5000025, 5000026, 5000029, 5000030, 5000031,
            5000032, 5000033, 5000034, 5000036, 5000037, 5000039, 5000041, 5000044, 5000045, 5000048,
            5000049, 5000050, 5000051, 5000052, 5000053, 5000055, 5000058, 5000060, 5000066, 5000100,
            5000101, 5000102
        };
    }

    @Override
    public int[] getUncommonItems() {
        return new int[]{};
    }

    @Override
    public int[] getRareItems() {
        return new int[]{};
    }
}