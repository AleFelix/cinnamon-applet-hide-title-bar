const Applet = imports.ui.applet;
const Gdk = imports.gi.Gdk

function TitleBarHider(orientation, panel_height, instance_id) {
    this._init(orientation, panel_height, instance_id);
}

function containsObject(list, obj) {
    for (var i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

TitleBarHider.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(orientation, panel_height, instance_id) {
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);

        this.set_applet_icon_name("view-restore");
        this.set_applet_tooltip(_("Click here to hide/unhide the title bar of the active window"));
        global.windows_with_hidden_title_bars = [];
    },

    on_applet_clicked: function() {
        global.log("WORKING!!");
        let screen = Gdk.Screen.get_default();
        let gdk_win = screen.get_active_window();
        if (gdk_win) {
            let is_hidden = containsObject(global.windows_with_hidden_title_bars, gdk_win);
            if (is_hidden) {
                gdk_win.set_decorations(Gdk.WMDecoration.ALL);
                gdk_win.unref();
            } else {
                global.windows_with_hidden_title_bars.push(gdk_win);
                gdk_win.set_decorations(Gdk.WMDecoration.BORDER);
                let [x, y] = gdk_win.get_position();
                gdk_win.move(0,0);
                gdk_win.resize(gdk_win.get_width() + x, gdk_win.get_height() + y);
            }
        }
    }
};


function main(metadata, orientation, panel_height, instance_id) {
    return new TitleBarHider(orientation, panel_height, instance_id);
}