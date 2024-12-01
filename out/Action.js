import { Err } from "./Err.js";
import { Check } from "./Check.js";
const actionTypeStrings = ['set_image', 'clear_image', 'none', 'print', 'print_event', 'select_lineBrush', 'draw_line', 'draw_rect', 'draw_circle', 'erase', 'stopCurrentDrawing', 'select_color', 'draw_free', 'move_menu'];
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
export class Action {
    constructor(actType, regionName, param) {
        this._actType = actType;
        this._onRegionName = regionName !== null && regionName !== void 0 ? regionName : "";
        this._param = param !== null && param !== void 0 ? param : "";
        this._onRegion = undefined;
        // list of all regions, will be established once we have the whole FSM
        this._regionLs = [];
    }
    // Construct an Action from an Action_json object.  We type check all the parts here
    // since data coming from json parsing lives in javascript land and may not actually 
    // be typed at runtime as we have declared it here.
    static fromJson(jsonVal) {
        var _a, _b;
        const actType = Check.limitedString(jsonVal.act, actionTypeStrings, "none", "Action.fromJson{act:}");
        const regionname = Check.stringVal((_a = jsonVal.region) !== null && _a !== void 0 ? _a : "", "Action.fromJsonl{region:}");
        const param = Check.stringVal((_b = jsonVal.param) !== null && _b !== void 0 ? _b : "", "Action.fromJson{param:}");
        return new Action(actType, regionname, param);
    }
    get actType() { return this._actType; }
    get onRegionName() { return this._onRegionName; }
    get onRegion() { return this._onRegion; }
    get param() { return this._param; }
    //-------------------------------------------------------------------
    // Methods
    //-------------------------------------------------------------------
    // Carry out the action represented by this object.  evtType and evtReg describe
    // the event which is causing the action (for use by print_event actions).
    execute(evtType, evtReg, evt) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this._actType === 'none')
            return;
        console.log("evtType:", evtType);
        console.log("actType:", this._actType);
        // **** YOUR CODE HERE ****
        switch (this._actType) {
            case 'set_image':
                // set the image of the given region (or rather where it is to be 
                //loaded from) based on the parameter value. 
                if (this.onRegion) {
                    this.onRegion.imageLoc = this.param;
                }
                break;
            case 'clear_image':
                //   - clear_image set the image of the given region to empty/none. 
                if (this.onRegion) {
                    this.onRegion.imageLoc = "";
                }
                break;
            case 'print':
                // Print the parameter value
                console.log(this._param);
                break;
            case 'print_event':
                // print the parameter value followed by a dump of the current event 
                console.log("Current event: ", this._param, evtType, evtReg === null || evtReg === void 0 ? void 0 : evtReg.debugString());
                break;
            case 'draw_line':
                //  draw a straight line
                console.log("action: draw_line");
                (_a = this.onRegion) === null || _a === void 0 ? void 0 : _a.startDraw('line');
                break;
            case 'draw_rect':
                // draw a rectangle
                console.log("action: draw_rect");
                (_b = this.onRegion) === null || _b === void 0 ? void 0 : _b.startDraw('rect');
                break;
            case 'draw_circle':
                // draw a circle
                console.log("action: draw_circle");
                (_c = this.onRegion) === null || _c === void 0 ? void 0 : _c.startDraw('circle');
                break;
            case 'erase':
                console.log("action: erase");
                (_d = this.onRegion) === null || _d === void 0 ? void 0 : _d.startDraw('erase');
                break;
            case 'stopCurrentDrawing':
                // stop drawing by remove all listeners
                console.log("stopCurrentDrawing");
                (_e = this.onRegion) === null || _e === void 0 ? void 0 : _e.removeListeners();
                break;
            case "select_color":
                // show color selection and stroke size
                (_f = this.onRegion) === null || _f === void 0 ? void 0 : _f.showColorWheel(evt);
                break;
            case 'draw_free':
                // draw freely
                console.log("action: draw free");
                (_g = this.onRegion) === null || _g === void 0 ? void 0 : _g.startDraw('free');
                break;
            case 'move_menu':
                // move menu bar around with cursor
                (_h = this.onRegion) === null || _h === void 0 ? void 0 : _h.moveMenu(this._regionLs);
                break;
        }
    }
    //. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    // Attempt to find the name listed for this region in the given list of regions
    // (from the whole FSM), assiging the Region object to this._onRegion if found.
    bindRegion(regionList) {
        this._regionLs = regionList;
        // **** YOUR CODE HERE ****
        // loop over the region list to find the one which matches name for this region
        for (let region of regionList) {
            if (region.name === this.onRegionName) {
                this._onRegion = region;
                return;
            }
        }
        // ok to have no matching region for some actions
        if (this.actType === 'none' || this.actType === 'print' ||
            this.actType === 'print_event') {
            this._onRegion = undefined;
            return;
        }
        Err.emit(`Region '${this._onRegionName}' in action does not match any region.`);
    }
    //-------------------------------------------------------------------
    // Debugging Support
    //-------------------------------------------------------------------
    // Create a short human readable string representing this object for debugging
    debugTag() {
        return `Action(${this.actType} ${this.onRegionName} "${this.param}")`;
    }
    //. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    // Create a human readable string displaying this object for debugging purposes
    debugString(indent = 0) {
        let result = "";
        const indentStr = '  '; // two spaces per indent level
        // produce the indent
        for (let i = 0; i < indent; i++)
            result += indentStr;
        // main display
        result += `${this.actType} ${this.onRegionName} "${this.param}"`;
        // possible warning about an unbound region
        if (!this.onRegion && this.actType !== 'none' &&
            this.actType !== 'print' && this.actType !== 'print_event') {
            result += " unbound";
        }
        return result;
    }
    //. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    // Log a human readable string for this object to the console
    dump() {
        console.log(this.debugString());
    }
} // end class Action
//===================================================================
//# sourceMappingURL=Action.js.map