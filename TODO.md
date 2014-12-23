TODO - React vs Games
===========

 0.1 : remake
-------------
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
   [ ] Real patterns!!
 [X] Make different kind of ennemies
  [X] Duo : same as ouno but slower and tougher
  [X] Trio : faster, less life and can shoot
  [ ] BOSS?
 [X] Ship is invisible for a short period when destroyed
 [X] Add special FX
  [X] Explosion
  [X] Stars
  [X] Flash (when ship explod)
 [X] Sub screens
  [X] Wave intro
 [ ] Sound effects
 [ ] Polish
  [X] Font
  [ ] Animations (text, more?)
   [ ] Sequence FX animations with a callback
 [ ] Defeat
 [ ] Textual cut scenes
 [ ] Wepons
 [ ] Combos

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
 [X] Ennemies have life
 [X] Ship life is unlimited but ship can't shoot nor collide when invicible
 [X] Life (as in the HUD) are time machine tockens used when earth is defeated

TOOLS / Framework
-----------------

 [ ] Message sent in the future
 [X] Fx main module (just one import)

CLEAN
-----

 [ ] Construct model in an immutable way
