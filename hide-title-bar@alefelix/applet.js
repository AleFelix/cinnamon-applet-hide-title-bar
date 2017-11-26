const Applet = imports.ui.applet;
const Gdk = imports.gi.Gdk;
const Main = imports.ui.main;

function TitleBarHider(orientation, panel_height, instance_id) {
    this._init(orientation, panel_height, instance_id);
}

function contains_object(list, obj) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return [true, i];
        }
    }
    return [false, -1];
}

function restore_all_title_bars() {
    let winds = global.windows_with_hidden_title_bars;
    for (var pos = 0; pos < winds.length; pos++) {
        try {
            winds[pos].set_decorations(Gdk.WMDecoration.ALL);
        } catch(error) {
            global.log("Can't restore the titlebar of the window, skipping");
        }
    }
    Gdk.Window.process_all_updates();
    global.windows_with_hidden_title_bars = [];
}

function edit_cinnamon_shutdown_sequence() {
    var old_shutdown_sequence = Main.do_shutdown_sequence;
    Main.do_shutdown_sequence = function() {
        restore_all_title_bars();
        old_shutdown_sequence();
    }
}

function remove_from_window_list(window) {
    let [found, index] = contains_object(global.windows_with_hidden_title_bars, window);
    if (found) {
        global.windows_with_hidden_title_bars.splice(index, 1);
        //TODO: Find a way to get the id of the window, to avoid storing the references in the array
        window.unref();
    }
}

//Not working, win.destroy() is not called when the user press the close button...
//TODO: Find which function is called when the user close a window
function edit_window_destroy_behavior(window) {
    var old_destroy = window.destroy;
    window.destroy = function() {
        remove_from_window_list(window);
        old_destroy();
    }
}

TitleBarHider.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(orientation, panel_height, instance_id) {
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);

        this.set_applet_icon_name("view-restore");
        this.set_applet_tooltip(_("Click here to hide/unhide the title bar of the active window"));
        global.windows_with_hidden_title_bars = [];
        edit_cinnamon_shutdown_sequence();
    },

    on_applet_clicked: function() {
        global.log("WORKING!!");
        let screen = Gdk.Screen.get_default();
        let gdk_win = screen.get_active_window();
        if (gdk_win) {
            let [is_hidden, index] = contains_object(global.windows_with_hidden_title_bars, gdk_win);
            if (is_hidden) {
                gdk_win.set_decorations(Gdk.WMDecoration.ALL);
                remove_from_window_list(gdk_win);
            } else {
                edit_window_destroy_behavior(gdk_win);
                global.windows_with_hidden_title_bars.push(gdk_win);
                gdk_win.set_decorations(Gdk.WMDecoration.BORDER);
                let [x, y] = gdk_win.get_position();
                gdk_win.moveresize(0,0,gdk_win.get_width() + x, gdk_win.get_height() + y);
            }
        }
    },

    on_applet_removed_from_panel: function() {
        restore_all_title_bars();
    }
};


function main(metadata, orientation, panel_height, instance_id) {
    return new TitleBarHider(orientation, panel_height, instance_id);
}