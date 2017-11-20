# cinnamon-applet-hide-title-bar
A Cinnamon applet for hiding/unhiding the title bar of the active window

WARNING: This is an experimental applet and can cause Cinnamon to crash, use it at your own risk!

Installation:
 - Copy the folder "hide-title-bar@alefelix" to "~/.local/share/cinnamon/applets"
 - Right click on the panel and select "Add applets to the panel"
 - Select "Hide Title Bar"
 
 Usage:
 - Click on the "Hide Title Bar" button to hide (or unhide) the title bar of the currently active window
 - The applet can hide the title bar of multiple windows simultaneously
 
 Bugs:
 - ~~Sometimes it's necessary to click the applet button twice to hide the title bar~~ (Fixed)
 - Windows can't be moved until the title bar is restored
 - Cinnamon sometimes crash and needs to be restarted
 
 Credits:
 - [@lestcape](https://github.com/lestcape) for the decorate and undecorate methods from this comment: https://github.com/linuxmint/muffin/issues/183#issuecomment-99124695
