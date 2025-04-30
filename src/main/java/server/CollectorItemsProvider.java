package server;

import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CollectorItemsProvider {
    private static final Logger log = LoggerFactory.getLogger(CollectorItemsProvider.class);
    private static CollectorItemsProvider instance = null;
    private final Map<String, List<Integer>> categoryItems = new HashMap<>();
    private final List<Integer> allItems = new ArrayList<>();

    private CollectorItemsProvider() {
        loadCollectorItems();
    }

    public static CollectorItemsProvider getInstance() {
        if (instance == null) {
            instance = new CollectorItemsProvider();
        }
        return instance;
    }

    private void loadCollectorItems() {
        try {
            InputStream is = getClass().getResourceAsStream("/CollectorItems.json");
            if (is == null) {
                log.error("CollectorItems.json not found");
                return;
            }

            JSONParser parser = new JSONParser();
            JSONObject jsonData = (JSONObject) parser.parse(new InputStreamReader(is));
            JSONObject categories = (JSONObject) jsonData.get("categories");

            for (Object key : categories.keySet()) {
                String category = (String) key;
                JSONArray items = (JSONArray) categories.get(category);
                List<Integer> itemIds = new ArrayList<>();

                for (Object item : items) {
                    JSONObject itemObj = (JSONObject) item;
                    int itemId = ((Long) itemObj.get("id")).intValue();
                    itemIds.add(itemId);
                    allItems.add(itemId);
                }

                categoryItems.put(category, itemIds);
            }
        } catch (Exception e) {
            log.error("Error loading collector items", e);
        }
    }

    public List<Integer> getAllCollectableItems() {
        return new ArrayList<>(allItems);
    }

    public List<Integer> getItemsByCategory(String category) {
        return categoryItems.getOrDefault(category, new ArrayList<>());
    }

    public Map<String, List<Integer>> getAllCategorizedItems() {
        return new HashMap<>(categoryItems);
    }
}