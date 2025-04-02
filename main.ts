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
    for (let tile of [assets.tile`water`, assets.tile`water_top_1`, assets.tile`water_top_2`]) {
        if (s.tileKindAt(TileDirection.Center, tile)) {
            return true
        }
    }
    return false
}
function player_on_game_update (sprite: Sprite) {
    if (sprite_in_water(sprite)) {
        if (!(stateTransitions.spriteStateIs(sprite, "swimming") || stateTransitions.spriteStateIs(sprite, "dashing"))) {
            stateTransitions.spriteChangeState(sprite, "swimming")
        }
    }
    if (is_sprite_hitting_wall(sprite)) {
        if (stateTransitions.spriteStateIs(sprite, "dashing") && !(sprite.isHittingTile(CollisionDirection.Bottom) && sprites.readDataBoolean(sprite, "dash_on_floor"))) {
            stateTransitions.spriteChangeState(sprite, "walking")
            effect = extraEffects.createCustomSpreadEffectData(
            unique_colors_in_tile(tiles.tileImageAtLocation(location_sprite_hitting(sprite))),
            true,
            extraEffects.createPresetSizeTable(ExtraEffectPresetShape.Explosion),
            extraEffects.createPercentageRange(50, 100),
            extraEffects.createPercentageRange(50, 100),
            extraEffects.createTimeRange(200, 400)
            )
            effect.z = -3
            if (sprite.isHittingTile(CollisionDirection.Left)) {
                extraEffects.createSpreadEffectAt(effect, sprite.left, sprite.y, 100, 17)
            } else if (sprite.isHittingTile(CollisionDirection.Top)) {
                extraEffects.createSpreadEffectAt(effect, sprite.x, sprite.top, 100, 17)
            } else if (sprite.isHittingTile(CollisionDirection.Right)) {
                extraEffects.createSpreadEffectAt(effect, sprite.right, sprite.y, 100, 17)
            } else if (sprite.isHittingTile(CollisionDirection.Bottom)) {
                extraEffects.createSpreadEffectAt(effect, sprite.x, sprite.bottom, 100, 17)
            }
        }
    }
    if (characterAnimations.matchesRule(sprite, characterAnimations.rule(Predicate.NotMoving))) {
        timer.throttle("hp_restore_while_still", sprites.readDataNumber(sprite, "health_restore_every_while_still") + randint(sprites.readDataNumber(sprite, "health_restore_every_while_still") * 0.2 * -1, sprites.readDataNumber(sprite, "health_restore_every_while_still") * 0.2), function () {
            sprites.setDataNumber(sprite, "health", Math.min(sprites.readDataNumber(sprite, "health") + sprites.readDataNumber(sprite, "health_restore_while_still"), sprites.readDataNumber(sprite, "health_max")))
        })
    } else {
        timer.throttle("hp_restore", sprites.readDataNumber(sprite, "health_restore_every") + randint(sprites.readDataNumber(sprite, "health_restore_every") * 0.2 * -1, sprites.readDataNumber(sprite, "health_restore_every") * 0.2), function () {
            sprites.setDataNumber(sprite, "health", Math.min(sprites.readDataNumber(sprite, "health") + sprites.readDataNumber(sprite, "health_restore"), sprites.readDataNumber(sprite, "health_max")))
        })
    }
    if (SHOW_PLAYER_DEBUG) {
        debug_string = ""
        debug_string = "" + debug_string + stateTransitions.spriteState(sprite)
        if (characterAnimations.matchesRule(sprite, characterAnimations.rule(Predicate.NotMoving))) {
            debug_string = "" + debug_string + "\\nHP " + sprites.readDataNumber(sprite, "health") + "/" + sprites.readDataNumber(sprite, "health_max") + " (+" + sprites.readDataNumber(sprite, "health_restore_while_still") + "/" + sprites.readDataNumber(sprite, "health_restore_every_while_still") + "ms)"
        } else {
            debug_string = "" + debug_string + "\\nHP " + sprites.readDataNumber(sprite, "health") + "/" + sprites.readDataNumber(sprite, "health_max") + " (+" + sprites.readDataNumber(sprite, "health_restore") + "/" + sprites.readDataNumber(sprite, "health_restore_every") + "ms)"
        }
        debug_string = "" + debug_string + "\\nJMP " + sprites.readDataNumber(sprite, "jump_count") + "/" + sprites.readDataNumber(sprite, "jump_max")
        debug_string = "" + debug_string + "\\nDSH " + sprites.readDataNumber(sprite, "dash_count") + "/" + sprites.readDataNumber(sprite, "dash_max")
        sprite.sayText(debug_string)
        if (spriteutils.isDestroyed(sprites.readDataSprite(sprite, "debug_tile"))) {
            sprites.setDataSprite(sprite, "debug_tile", sprites.create(img`
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 . . . . . . . . . . . . . . 2 
                2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
                `, SpriteKind.Player))
        }
        tiles.placeOnTile(sprites.readDataSprite(sprite, "debug_tile"), sprite.tilemapLocation())
        sprites.readDataSprite(sprite, "debug_tile").image.drawRect(0, 0, 16, 16, 2)
        if (sprite.isHittingTile(CollisionDirection.Top)) {
            sprites.readDataSprite(sprite, "debug_tile").image.fillRect(0, 0, 16, 2, 4)
        } else {
            sprites.readDataSprite(sprite, "debug_tile").image.drawLine(1, 1, 14, 1, 0)
        }
        if (sprite.isHittingTile(CollisionDirection.Left)) {
            sprites.readDataSprite(sprite, "debug_tile").image.fillRect(0, 0, 2, 16, 4)
        } else {
            sprites.readDataSprite(sprite, "debug_tile").image.drawLine(1, 1, 1, 14, 0)
        }
        if (sprite.isHittingTile(CollisionDirection.Right)) {
            sprites.readDataSprite(sprite, "debug_tile").image.fillRect(14, 0, 2, 16, 4)
        } else {
            sprites.readDataSprite(sprite, "debug_tile").image.drawLine(14, 1, 14, 14, 0)
        }
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            sprites.readDataSprite(sprite, "debug_tile").image.fillRect(0, 14, 16, 2, 4)
        } else {
            sprites.readDataSprite(sprite, "debug_tile").image.drawLine(1, 14, 14, 14, 0)
        }
    }
}
function is_sprite_hitting_wall (s: Sprite) {
    return s.isHittingTile(CollisionDirection.Left) || s.isHittingTile(CollisionDirection.Top) || (s.isHittingTile(CollisionDirection.Right) || s.isHittingTile(CollisionDirection.Bottom))
}
function create_base_environment () {
    scene.setBackgroundColor(9)
    tiles.setCurrentTilemap(tilemap`level2`)
}
function create_player () {
    sprite_player = sprites.create(img`
        . . . . . . f f f f . . . . . . 
        . . . . f f f 2 2 f f f . . . . 
        . . . f f f 2 2 2 2 f f f . . . 
        . . f f f e e e e e e f f f . . 
        . . f f e 2 2 2 2 2 2 e e f . . 
        . . f e 2 f f f f f f 2 e f . . 
        . . f f f f e e e e f f f f . . 
        . f f e f b f 4 4 f b f e f f . 
        . f e e 4 1 f d d f 1 4 e e f . 
        . . f e e d d d d d d e e f . . 
        . . . f e e 4 4 4 4 e e f . . . 
        . . e 4 f 2 2 2 2 2 2 f 4 e . . 
        . . 4 d f 2 2 2 2 2 2 f d 4 . . 
        . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
        . . . . . f f f f f f . . . . . 
        . . . . . f f . . f f . . . . . 
        `, SpriteKind.Player)
    if (SHOW_PLAYER_DEBUG) {
        sprite_player.setFlag(SpriteFlag.ShowPhysics, true)
    }
    sprites.setDataNumber(sprite_player, "health", 0)
    sprites.setDataNumber(sprite_player, "health_max", 100)
    sprites.setDataNumber(sprite_player, "health_restore", 1)
    sprites.setDataNumber(sprite_player, "health_restore_every", 500)
    sprites.setDataNumber(sprite_player, "health_restore_while_still", 1)
    sprites.setDataNumber(sprite_player, "health_restore_every_while_still", 200)
    sprites.setDataNumber(sprite_player, "move_speed", 100)
    sprites.setDataNumber(sprite_player, "move_speed_in_water", 50)
    sprites.setDataNumber(sprite_player, "gravity", 500)
    sprites.setDataNumber(sprite_player, "gravity_in_water", 50)
    sprites.setDataNumber(sprite_player, "jump_height", 34)
    sprites.setDataNumber(sprite_player, "jump_count", 0)
    sprites.setDataNumber(sprite_player, "jump_max", 2)
    sprites.setDataNumber(sprite_player, "dash_speed", 300)
    sprites.setDataNumber(sprite_player, "dash_distance", 80)
    sprites.setDataNumber(sprite_player, "dash_count", 0)
    sprites.setDataNumber(sprite_player, "dash_max", 2)
    sprites.setDataBoolean(sprite_player, "dash_on_floor", false)
    sprites.setDataNumber(sprite_player, "slow_fall_speed", 100)
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Enter, "unmoving", function (sprite) {
        controller.moveSprite(sprite, 0, 0)
        sprite.setVelocity(0, 0)
        sprite.ax = 0
        sprite.ay = 0
    })
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Enter, "walking", function (sprite) {
        controller.moveSprite(sprite, sprites.readDataNumber(sprite, "move_speed"), 0)
        sprite.ay = sprites.readDataNumber(sprite, "gravity")
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "walking", stateTransitions.Player.One, stateTransitions.Button.Up, ControllerButtonEvent.Pressed, function (sprite) {
        if (sprites.readDataNumber(sprite, "jump_count") < sprites.readDataNumber(sprite, "jump_max")) {
            spriteutils.jumpImpulse(sprite, 34)
            sprites.changeDataNumberBy(sprite, "jump_count", 1)
            if (!(sprite_player.isHittingTile(CollisionDirection.Bottom))) {
                effect = extraEffects.createCustomSpreadEffectData(
                [11],
                true,
                extraEffects.createPresetSizeTable(ExtraEffectPresetShape.Spark),
                extraEffects.createPercentageRange(10, 30),
                extraEffects.createPercentageRange(10, 30),
                extraEffects.createTimeRange(50, 100),
                0,
                0,
                extraEffects.createPercentageRange(50, 100),
                0,
                10,
                200
                )
                effect.z = -3
                extraEffects.createSpreadEffectAt(effect, sprite_player.x, sprite_player.bottom, 100, 17)
            }
        }
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "walking", stateTransitions.Player.One, stateTransitions.Button.B, ControllerButtonEvent.Pressed, function (sprite) {
        if (is_arrow_key_pressed() && (sprites.readDataNumber(sprite, "dash_count") < sprites.readDataNumber(sprite, "dash_max") || controller.down.isPressed())) {
            stateTransitions.spriteChangeState(sprite, "dashing")
        }
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "walking", stateTransitions.Player.One, stateTransitions.Button.Down, ControllerButtonEvent.Pressed, function (sprite) {
        stateTransitions.spriteChangeState(sprite, "slow_falling")
    })
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Update, "walking", function (sprite) {
        if (sprite.isHittingTile(CollisionDirection.Bottom)) {
            sprites.setDataNumber(sprite, "jump_count", 0)
            sprites.setDataNumber(sprite, "dash_count", 0)
        }
        if ((sprite.isHittingTile(CollisionDirection.Left) && controller.left.isPressed() || sprite.isHittingTile(CollisionDirection.Right) && controller.right.isPressed()) && distance_from_bottom_to_wall_below(sprite) > 32) {
            stateTransitions.spriteChangeState(sprite, "clinging")
        }
        player_on_game_update(sprite)
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "slow_falling", stateTransitions.Player.One, stateTransitions.Button.Down, ControllerButtonEvent.Released, function (sprite) {
        stateTransitions.spriteChangeState(sprite, "walking")
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "slow_falling", stateTransitions.Player.One, stateTransitions.Button.B, ControllerButtonEvent.Pressed, function (sprite) {
        stateTransitions.spriteChangeState(sprite, "dashing")
    })
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Update, "slow_falling", function (sprite) {
        if (sprite.vy > sprites.readDataNumber(sprite, "slow_fall_speed")) {
            sprite.vy = sprites.readDataNumber(sprite, "slow_fall_speed")
        }
        player_on_game_update(sprite)
    })
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Enter, "clinging", function (sprite) {
        controller.moveSprite(sprite, sprites.readDataNumber(sprite, "move_speed"), 0)
        sprite.setVelocity(0, 0)
        sprite.ax = 0
        sprite.ay = 0
        sprites.setDataNumber(sprite, "jump_count", 0)
        sprites.setDataNumber(sprite, "dash_count", 0)
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "clinging", stateTransitions.Player.One, stateTransitions.Button.Right, ControllerButtonEvent.Released, function (sprite) {
        if (sprite.isHittingTile(CollisionDirection.Right)) {
            stateTransitions.spriteChangeState(sprite, "walking")
        }
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "clinging", stateTransitions.Player.One, stateTransitions.Button.Left, ControllerButtonEvent.Released, function (sprite) {
        if (sprite.isHittingTile(CollisionDirection.Left)) {
            stateTransitions.spriteChangeState(sprite, "walking")
        }
    })
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Update, "clinging", function (sprite) {
        if (!(sprite.isHittingTile(CollisionDirection.Left)) && !(sprite.isHittingTile(CollisionDirection.Right))) {
            stateTransitions.spriteChangeState(sprite, "walking")
        }
        player_on_game_update(sprite)
    })
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Enter, "dashing", function (sprite) {
        controller.moveSprite(sprite, 0, 0)
        sprite.ay = sprites.readDataNumber(sprite, "gravity")
        sprites.changeDataNumberBy(sprite, "dash_count", 1)
        if (controller.up.isPressed()) {
            sprite.vy = sprites.readDataNumber(sprite, "dash_speed") * -1
        } else if (controller.right.isPressed()) {
            sprite.vx = sprites.readDataNumber(sprite, "dash_speed")
        } else if (controller.left.isPressed()) {
            sprite.vx = sprites.readDataNumber(sprite, "dash_speed") * -1
        } else {
            sprite.vy = sprites.readDataNumber(sprite, "dash_speed") * 2
            sprites.changeDataNumberBy(sprite, "dash_count", -1)
        }
        sprites.setDataBoolean(sprite, "dash_on_floor", sprite.isHittingTile(CollisionDirection.Bottom))
        stateTransitions.spriteChangeState(sprite, "walking", sprites.readDataNumber(sprite, "dash_distance") / sprites.readDataNumber(sprite, "dash_speed") * 1000)
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "dashing", stateTransitions.Player.One, stateTransitions.Button.B, ControllerButtonEvent.Released, function (sprite) {
        stateTransitions.spriteChangeState(sprite, "walking")
    })
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Update, "dashing", function (sprite) {
        effect = extraEffects.createCustomSpreadEffectData(
        [4, 5],
        false,
        extraEffects.createPresetSizeTable(ExtraEffectPresetShape.Twinkle),
        extraEffects.createPercentageRange(50, 100),
        extraEffects.createPercentageRange(50, 100),
        extraEffects.createTimeRange(200, 400)
        )
        effect.z = -1
        extraEffects.createSpreadEffectOnAnchor(sprite_player, effect, 100, 14, 25)
        player_on_game_update(sprite)
    })
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Enter, "swimming", function (sprite) {
        controller.moveSprite(sprite, sprites.readDataNumber(sprite, "move_speed_in_water"), 0)
        sprite.ay = sprites.readDataNumber(sprite, "gravity_in_water")
        sprites.setDataNumber(sprite, "jump_count", 0)
        sprites.setDataNumber(sprite, "dash_count", 0)
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "swimming", stateTransitions.Player.One, stateTransitions.Button.Up, ControllerButtonEvent.Pressed, function (sprite) {
        spriteutils.jumpImpulse(sprite, sprites.readDataNumber(sprite, "jump_height"))
    })
    stateTransitions.spriteOnButtonEvent(sprite_player, "swimming", stateTransitions.Player.One, stateTransitions.Button.B, ControllerButtonEvent.Pressed, function (sprite) {
        if (is_arrow_key_pressed() && sprites.readDataNumber(sprite, "dash_count") < sprites.readDataNumber(sprite, "dash_max")) {
            stateTransitions.spriteChangeState(sprite, "dashing")
        }
    })
    stateTransitions.spriteOnStateEvent(sprite_player, stateTransitions.TransitionEvent.Update, "swimming", function (sprite) {
        sprite.vx = Math.constrain(sprite.vx, sprites.readDataNumber(sprite, "move_speed_in_water") * -1, sprites.readDataNumber(sprite, "move_speed_in_water"))
        sprite.vy = Math.constrain(sprite.vy, sprites.readDataNumber(sprite, "move_speed_in_water") * -1, sprites.readDataNumber(sprite, "move_speed_in_water"))
        if (!(sprite_in_water(sprite))) {
            stateTransitions.spriteChangeState(sprite, "walking")
        }
        player_on_game_update(sprite)
    })
    stateTransitions.spriteOnStateChange(sprite_player, function (oldState, newState) {
        if (oldState == "swimming" && newState == "walking") {
            effect = extraEffects.createCustomSpreadEffectData(
            [12, 15],
            false,
            extraEffects.createPresetSizeTable(ExtraEffectPresetShape.Twinkle),
            extraEffects.createPercentageRange(20, 80),
            extraEffects.createPercentageRange(20, 100),
            extraEffects.createTimeRange(200, 400)
            )
            effect.z = -1
            extraEffects.createSpreadEffectOnAnchor(sprite_player, effect, 200, 7, 25)
        }
    })
    stateTransitions.spriteChangeState(sprite_player, "walking")
    scene.cameraFollowSprite(sprite_player)
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
let sprite_player: Sprite = null
let debug_string = ""
let effect: SpreadEffectData = null
let local_loc: tiles.Location = null
let SHOW_PLAYER_DEBUG = false
stats.turnStats(true)
SHOW_PLAYER_DEBUG = true
create_base_environment()
create_player()
game.onUpdate(function () {
    timer.throttle("environment_water_effect", 2000, function () {
        timer.background(function () {
            tileUtil.replaceAllTiles(assets.tile`water_top_1`, assets.tile`water_top_2`)
            pause(1000)
            tileUtil.replaceAllTiles(assets.tile`water_top_2`, assets.tile`water_top_1`)
        })
    })
})
