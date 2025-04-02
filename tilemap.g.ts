// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile15 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile18 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level2":
            case "level2":return tiles.createTilemap(hex`100010000000000000000000000000000000000000000000000000000000000000000000000000000f00000000000000000000000000000000000000000000000000000000000f00000000000000000e0c0d00000000000000000000000000090b0a00000000000000000000000000090b0a00000000100101080000000000090b0a00000000070202060000000000090b0a00000101050202110800000000000000000002020202020206000000000000000000000000000000000000000e04040404040000000000000000000009030303030300000000000000000000090b0b0b0b0b00000000000000000000090b0b0b0b0b00000000000000000000000000000000`, img`
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
. . . . . . . . . . . . . . . . 
`, [myTiles.transparency16,grafxkid.springGroundTop,grafxkid.springGround,myTiles.tile15,myTiles.tile16,grafxkid.springGroundInnerBottomRight,grafxkid.springGroundRight,grafxkid.springGroundLeft,grafxkid.springGroundTopRight,grafxkid.springGroundLeftAlt,grafxkid.springGroundRightAlt,grafxkid.springGroundAlt,grafxkid.springGroundTopAlt,grafxkid.springGroundTopRightAlt,grafxkid.springGroundTopLeftAlt,grafxkid.springBlock,grafxkid.springGroundTopLeft,grafxkid.springGroundInnerBottomLeft], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "water":
            case "tile15":return tile15;
            case "water_top_1":
            case "tile16":return tile16;
            case "water_top_2":
            case "tile18":return tile18;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
