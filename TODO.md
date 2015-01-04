TODO - React vs Games
===========

 0.1 : remake
-------------
 [ ] PROPER LOADING
  [ ] FOUT FIX!
 [X] Add screens system
  [x] sortof
  [x] intro
  [x] Add back the game
  [X] Game Over
 [X] Fix position (make rockets shoot straight)
 [ ] Script sequence of ennemies
  [X] Basic wave system
  [X] Script how the enemies enter the screen
   [X] Simple dispatch : equal space of all the ennemies entering the screen at the same time
   [X] original position patterns?
   [X] move patterns
   [X] Real patterns!! : based on speed?
 [X] Make different kind of ennemies
  [X] Duo : faster and less life
  [X] Trio : slower, more life and can shoot
  [ ] BOSS?
  [ ] Ninja
 [X] Ship is invincible for a short period when destroyed
 [X] Add special FX
  [X] Explosion
  [X] Stars
  [X] Flash (when ship explod)
  [X] ScreenShake
  [X] Better explosions (with discs)
  [ ] Feedback on winning baddies
 [X] Sub screens
  [X] Wave intro
 [X] Sound effects
 [ ] More sounds
 [ ] Music
  [X] Main theme (sorta)
  [ ] Better music?
 [ ] Polish
  [X] Font
  [X] Animations (text, more?)
 [ ] Defeat
  [ ] Screen
  [ ] Animation
 [X] Textual cut scenes
  [X] Days
 [ ] Wepons
 [ ] Combos
 [X] Bullets limits gauge
 [ ] Cleanup
  [ ] Move all state ship parts into model
 [X] Laser beam as shooting aid
 [ ] Preview ennemies

 0.2 : Mobile
-------------

Gameplay
--------

 [X] Bullets push ennemies
 [X] Split in missions
 [X] Target of missions : have a limited number of ennemies reaching past the player
 [ ] Two type of weapons :
  [X] Bullets (push ennemies/very limited damage, fast, illimited qt, autofire?)
  [ ] Bomb/Rockets (destroy, slow, limited, cooldown/quantity?)
 [ ] Limit range of weapon
 [X] Ennemies have life
 [X] Ship life is unlimited but ship can't shoot nor collide when invicible
 [X] Life (as in the HUD) are time machine tockens used when earth is defeated
 [X] Bullets limits
 [ ] Killing ennemy gives energy boost and the normal energy replainish rate should be lower

TOOLS / Framework
-----------------

 [ ] Message sent in the future
 [X] Fx main module (just one import)

CLEAN
-----

 [ ] Construct model in an immutable way
