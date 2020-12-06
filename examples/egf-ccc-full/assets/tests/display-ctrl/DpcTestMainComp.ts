// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { DpcMgr } from "@ailhc/display-ctrl";
import { Layer } from "@ailhc/dpctrl-ccc";
import { App } from "@ailhc/egf-core";
import { LayerMgr } from "@ailhc/layer";
import { ObjPoolMgr } from "@ailhc/obj-pool";
import { DpcTestLayerType } from "./DpcTestLayerType";
import { dpcTestM, setDpcTestModuleMap } from "./setDpcTestModuleMap";
import { AsyncShowView } from "./view-ctrls/AsyncShowView";
import { CustomLoadView } from "./view-ctrls/CustomLoadView";
import { DepResView } from "./view-ctrls/DepResView";
import { LoadingView } from "./view-ctrls/LoadingView";
import { UnDepResView } from "./view-ctrls/UnDepResView";

const { ccclass, property } = cc._decorator;

declare global {
    interface IDpcTestViewKeyMap {

    }
    interface IDpcTestModuleMap {
        uiMgr: displayCtrl.IMgr<IDpcTestViewKeyMap>;
        layerMgr: egf.ILayerMgr<cc.Node>;
        poolMgr: objPool.IPoolMgr;
    }
}
@ccclass
export default class DpcTestMainComp extends cc.Component {

    onLoad() {
        const app = new App<IDpcTestModuleMap>();

        const dpcMgr = new DpcMgr();
        dpcMgr.init((config) => {
            cc.resources.load(config.ress, null, (err, items) => {
                if (err) {
                    config.error && config.error();
                } else {
                    config.complete && config.complete();
                }
            })
        })
        const layerMgr = new LayerMgr<cc.Node>();
        const canvas = cc.director.getScene().getChildByName("Canvas");
        cc.game.addPersistRootNode(canvas);

        layerMgr.init(canvas, DpcTestLayerType, Layer);
        app.loadModule(layerMgr, "layerMgr");
        app.loadModule(dpcMgr, "uiMgr");
        const objPoolMgr = new ObjPoolMgr();
        app.loadModule(objPoolMgr, "poolMgr");

        app.bootstrap();
        app.init();
        setDpcTestModuleMap(app.moduleMap);
        // TestView
        // dpcMgr.regist(LoadingView);
        dpcMgr.registTypes([LoadingView, AsyncShowView, CustomLoadView, DepResView, UnDepResView]);
    }
    start() {

    }
    showDepResView() {
        dpcTestM.uiMgr.showDpc(dpcTestM.uiMgr.ctrls.DepResView);
    }
    // update (dt) {}
}
