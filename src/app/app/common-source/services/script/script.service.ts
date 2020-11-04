import { Injectable } from '@angular/core';

import { ScriptsSet, Script } from './models/scripts';

@Injectable({
    providedIn: 'root'
})
export class ScriptService {
    private scriptList: any;
    private originScriptList: Script[];

    constructor() {
        this.scriptList = {};
        this.originScriptList = ScriptsSet;
        this.originScriptList.map(
            (item: Script) => {
                this.scriptList[item.name] = { loaded: false, src: item.src };
            }
        );
    }

    public async load(...scripts: string[]) {
        const promises: any[] = [];
        let scriptNameList = scripts;

        if (scriptNameList.length === 0) {
            scriptNameList = this.originScriptList.map(
                (item: Script) => item.name
            );
        }

        console.log(scriptNameList);
        scriptNameList.forEach(
            (script) => promises.push(this.loadScript(script))
        );

        return Promise.all(promises);
    }

    private async loadScript(name: string) {
        return new Promise(
            (resolve, reject) => {
                console.log(this.scriptList[name]);
                // resolve if already loaded
                if (this.scriptList[name].loaded) {
                    resolve({ script: name, loaded: true, status: '로딩 되어 있음.' });
                } else {
                    // load script
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = this.scriptList[name].src;
                    script.onload = () => {
                        this.scriptList[name].loaded = true;
                        console.log(`${name} Loaded.`);
                        resolve({ script: name, loaded: true, status: 'Loaded' });
                    };
                    script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
                    document.getElementsByTagName('head')[0].appendChild(script);
                }
            }
        );
    }
}