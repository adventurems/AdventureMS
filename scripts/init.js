// init.js - Common Java Class Initialization for GraalVM JavaScript
// This script pre-imports commonly used Java classes to make them globally available

// Player and Character related classes
global.Character = Java.type('client.Character');
global.AbstractPlayerInteraction = Java.type('scripting.AbstractPlayerInteraction');
global.BuffStat = Java.type('client.BuffStat');
global.Disease = Java.type('client.Disease');
global.MonsterBook = Java.type('client.MonsterBook');

// Inventory related
global.InventoryType = Java.type('client.inventory.InventoryType');
global.ItemInformationProvider = Java.type('server.ItemInformationProvider');

// Map and location related
global.MapleMap = Java.type('server.maps.MapleMap');
global.Point = Java.type('java.awt.Point');

// Life and monster related
global.LifeFactory = Java.type('server.life.LifeFactory');

// Scripting managers
global.ReactorActionManager = Java.type('scripting.reactor.ReactorActionManager');

// 2. Load this file before executing other scripts by adding to your Java code:
//    scriptEngine.eval(new FileReader("path/to/init.js"));
// 3. Now all these classes are available globally in your scripts without needing Java.type()