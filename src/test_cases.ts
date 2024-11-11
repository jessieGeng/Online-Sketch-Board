
import { Root } from "./Root.js";
import { FSMInteractor } from "./FSMInteractor.js";
import { Region,Region_json } from "./Region.js";
import { State } from "./State.js";
import { EventType, EventSpec_json, EventSpec } from "./EventSpec.js";
import { Action_json, Action } from "./Action.js";
import { FSM } from "./FSM.js";
import { Err } from "./Err.js";
import { Transition } from "./Transition.js";


//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

// The root object which will be linked to our canvas (which must have 
// an ID of "FSM-main-canvae"), and which we will build our test objects under.
let root : Root;

//-------------------------------------------------------------------
// Main testing routine -- invoked from index.html 
//-------------------------------------------------------------------
export function runTests() {
	console.log("Running...");
	
	root = new Root("FSM-main-canvas");
	root.doDebugOutput = true;

	// let r1 : Region = new Region("r1", "./images/line.png",   0,0,20, 20);
	// let r2 : Region = new Region("r2", "./images/rect.png",   20,0, -1,-1);
	// let r3 : Region = new Region("r3", "./images/circle.png", 40,0, -1,-1);
	// let r4 : Region = new Region("r4", "./images/erase.png",  60,0, 20, 20);

	// let ev1 = new EventSpec('any', '*');
	// let acts : Action[] = [];
	// acts[0] = new Action('print_event', "", "evt--->");
	// let tr1 : Transition = new Transition('only_state', ev1, acts)
	// let st1 : State = new State('only_state', [tr1]);

	// const fsm : FSM = new FSM([r1,r2,r3,r4], [st1]);
	// let fsmInt = new FSMInteractor(fsm);
	// root.addChild(fsmInt);

    let fsmInt = new FSMInteractor(undefined, 0,0);
	root.addChild(fsmInt);
	fsmInt.startLoadFromJson("./fsm_json/project.json", root);

	console.log("Test is set up...");
}

//-------------------------------------------------------------------
