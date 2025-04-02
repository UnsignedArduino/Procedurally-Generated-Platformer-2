function distance_from_bottom_to_wall_below (s: Sprite) {
    if (s.isHittingTile(CollisionDirection.Bottom)) {
        return 0
    }
    local_loc = s.tilemapLocation()
    while (!(tiles.tileAtLocationIsWall(local_loc))) {
        local_loc = local_loc.getNeighboringLocation(CollisionDirection.Bottom)
    }
    return local_loc.top - s.bottom
}
function is_arrow_key_pressed () {
    return controller.left.isPressed() || controller.up.isPressed() || (controller.right.isPressed() || controller.down.isPressed())
}
function location_sprite_hitting (s: Sprite) {
    if (s.isHittingTile(CollisionDirection.Left)) {
        return s.tilemapLocation().getNeighboringLocation(CollisionDirection.Left)
    } else if (s.isHittingTile(CollisionDirection.Top)) {
        return s.tilemapLocation().getNeighboringLocation(CollisionDirection.Top)
    } else if (s.isHittingTile(CollisionDirection.Right)) {
        return s.tilemapLocation().getNeighboringLocation(CollisionDirection.Right)
    } else if (s.isHittingTile(CollisionDirection.Bottom)) {
        return s.tilemapLocation().getNeighboringLocation(CollisionDirection.Bottom)
    } else {
        return s.tilemapLocation()
    }
}
function sprite_in_water (s: Sprite) {
    for (let tile of [assets.tile`myTile13`, assets.tile`myTile14`, assets.tile`myTile16`]) {
        if (s.tileKindAt(TileDirection.Center, tile)) {
            return true
        }
    }
    return false
}
function is_sprite_hitting_wall (s: Sprite) {
    return s.isHittingTile(CollisionDirection.Left) || s.isHittingTile(CollisionDirection.Top) || (s.isHittingTile(CollisionDirection.Right) || s.isHittingTile(CollisionDirection.Bottom))
}
function create_base_environment () {
    scene.setBackgroundColor(9)
    tiles.setCurrentTilemap(tilemap`level2`)
}
function unique_colors_in_tile (img2: Image) {
    local_colors = []
    for (let local_y = 0; local_y <= 15; local_y++) {
        for (let local_x = 0; local_x <= 15; local_x++) {
            if (!(img2.getPixel(local_x, local_y) == 0)) {
                local_colors.push(img2.getPixel(local_x, local_y))
            }
        }
    }
    arrays.purge(local_colors)
    return local_colors
}
let local_colors: number[] = []
let local_loc: tiles.Location = null
stats.turnStats(true)
let SHOW_PLAYER_DEBUG = false
create_base_environment()
