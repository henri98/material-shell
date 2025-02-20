const { GObject, St, Clutter, Gio } = imports.gi;

const Main = imports.ui.main;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const { RippleContainer } = Me.imports.widget.material.rippleContainer;
const { TaskBar } = Me.imports.widget.taskBar;

/* exported TopPanel */
var TopPanel = GObject.registerClass(
    class TopPanel extends St.Widget {
        _init(superWorkspace) {
            super._init({
                name: 'topPanel'
            });
            this.superWorkspace = superWorkspace;
            this._leftContainer = new St.BoxLayout();

            this.taskBar = new TaskBar(superWorkspace);
            this._leftContainer.add_child(this.taskBar);

            let iconContainer = new St.Bin({
                child: new St.Icon({
                    gicon: Gio.icon_new_for_string(
                        `${Me.path}/assets/icons/plus-symbolic.svg`
                    ),
                    style_class: 'workspace-icon'
                }),
                style_class: 'workspace-button',
                reactive: true,
                can_focus: true,
                track_hover: true
            });

            iconContainer.connect('button-press-event', () => {
                superWorkspace.revealBackground();
            });

            this.addButton = new RippleContainer(iconContainer);
            this._leftContainer.add_child(this.addButton);
            this.add_child(this._leftContainer);
            this.tilingIcon = new St.Icon({
                gicon: superWorkspace.tilingLayout.icon,
                style_class: 'workspace-icon'
            });

            let button = new St.Bin({
                child: this.tilingIcon,
                style_class: 'workspace-button',
                reactive: true,
                can_focus: true,
                track_hover: true
            });

            button.connect('button-press-event', () => {
                superWorkspace.nextTiling();
            });

            this.tilingButton = new RippleContainer(button);
            this.add_child(this.tilingButton);
        }

        vfunc_allocate(box, flags) {
            this.set_allocation(box, flags);

            let themeNode = this.get_theme_node();
            box = themeNode.get_content_box(box);
            let scaleFactor = St.ThemeContext.get_for_stage(global.stage)
                .scale_factor;
            box.x2 = box.x2 - 48 * scaleFactor;
            this._leftContainer.allocate(box, flags);

            let tilingButtonBox = new Clutter.ActorBox();
            tilingButtonBox.x1 = box.x2;
            tilingButtonBox.x2 = box.x2 + 48 * scaleFactor;
            tilingButtonBox.y1 = box.y1;
            tilingButtonBox.y2 = box.y2;
            this.tilingButton.allocate(tilingButtonBox, flags);
        }
    }
);
