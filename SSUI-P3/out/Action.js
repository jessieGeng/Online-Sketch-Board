import { Err } from "./Err.js";
import { Check } from "./Check.js";
const actionTypeStrings = ['set_image', 'clear_image', 'none', 'print', 'print_event', 'balloon_bigger', 'balloon_rest', 'hand_move', 'line_shorter', 'hand_rest', 'line_rest'];
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
export class Action {
    constructor(actType, regionName, param) {
        this._actType = actType;
        this._onRegionName = regionName !== null && regionName !== void 0 ? regionName : "";
        this._param = param !== null && param !== void 0 ? param : "";
        this._onRegion = undefined; // will be established once we have the whole FSM
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
    execute(evtType, evtReg) {
        if (this._actType === 'none')
            return;
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
            case 'balloon_bigger':
                // when we are inflating the balloon, make the picture of the balloon bigger
                if (this.onRegion) {
                    // if the balloon already boom... we cannot inflate it.
                    if (this.onRegion.imageLoc === "./images/boom.png") {
                        break;
                    }
                    // modify x and y such that it looks like the balloon is still on the same position
                    this.onRegion.x -= 5;
                    this.onRegion.y -= 10;
                    this.onRegion.w += 10;
                    this.onRegion.h += 10;
                    // when reach a random value it will boom...randomly.
                    if (this.onRegion.w > (Math.floor(Math.random() * 1000) + 100)) {
                        this.onRegion.imageLoc = this.param;
                    }
                }
                break;
            case 'hand_move':
                // when we are inflating the balloon, make the hand move up
                if (this.onRegion) {
                    this.onRegion.y -= 5;
                }
                break;
            case 'line_shorter':
                // when we are inflating the balloon, make the line shorter
                if (this.onRegion) {
                    this.onRegion.h -= 5;
                }
                break;
            case 'balloon_rest':
                if (this.onRegion) {
                    // reset the balloon to original params
                    this.onRegion.x = 0;
                    this.onRegion.y = 0;
                    this.onRegion.w = 50;
                    this.onRegion.h = 50;
                }
                break;
            case 'hand_rest':
                if (this.onRegion) {
                    // reset the handle to original params
                    this.onRegion.x = 15;
                    this.onRegion.y = 190;
                    this.onRegion.w = 20;
                    this.onRegion.h = 20;
                }
                break;
            case 'line_rest':
                if (this.onRegion) {
                    // reset the line to original params
                    this.onRegion.x = 0;
                    this.onRegion.y = 0;
                    this.onRegion.w = 100;
                    this.onRegion.h = 100;
                }
                break;
            default:
                throw new Error(`Unknown action type: ${this._actType}`);
        }
    }
    //. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    // Attempt to find the name listed for this region in the given list of regions
    // (from the whole FSM), assiging the Region object to this._onRegion if found.
    bindRegion(regionList) {
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