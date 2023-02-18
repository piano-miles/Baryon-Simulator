const appElement = document.getElementById('app');
const launchScreen = document.getElementById('launch');
const loadingScreen = document.getElementById('loading');
const loadingInner = document.getElementById('loading-inner');
const errorScreen = document.getElementById('error');
const errorScreenMessage = document.getElementById('error-message');
const errorScreenStack = document.getElementById('error-stack');

const handleError = (error) => {
    console.error(error);
    if (!errorScreen.hidden) return;
    errorScreen.hidden = false;
    errorScreenMessage.textContent = '' + error;
    let debug = error && error.stack || 'no stack';
    debug += '\nUser agent: ' + navigator.userAgent;
    errorScreenStack.textContent = debug;
};
const setProgress = (progress) => {
    if (loadingInner) loadingInner.style.width = progress * 100 + '%';
};
const interpolate = (a, b, t) => a + t * (b - a);

try {
    setProgress(0.1);

    const scaffolding = new Scaffolding.Scaffolding();
    scaffolding.width = 480;
    scaffolding.height = 360;
    scaffolding.resizeMode = "preserve-ratio";
    scaffolding.editableLists = false;
    scaffolding.usePackagedRuntime = true;
    scaffolding.setup();
    scaffolding.appendTo(appElement);

    const vm = scaffolding.vm;
    window.scaffolding = scaffolding;
    window.vm = scaffolding.vm;
    window.Scratch = {
        vm,
        renderer: vm.renderer,
        audioEngine: vm.runtime.audioEngine,
        bitmapAdapter: vm.runtime.v2BitmapAdapter,
        videoProvider: vm.runtime.ioDevices.video.provider
    };

    scaffolding.setUsername("player####".replace(/#/g, () => Math.floor(Math.random() * 10)));
    scaffolding.setAccentColor("#ff4c4c");

    scaffolding.addCloudProvider(new Scaffolding.Cloud.WebSocketProvider(["wss://clouddata.turbowarp.org", "wss://clouddata.turbowarp.xyz"], "p4-@Baryon Simulator.sb3"));

    vm.setTurboMode(false);
    if (vm.setInterpolation) vm.setInterpolation(false);
    if (vm.setFramerate) vm.setFramerate(60);
    if (vm.renderer.setUseHighQualityRender) vm.renderer.setUseHighQualityRender(true);
    if (vm.setRuntimeOptions) vm.setRuntimeOptions({
        fencing: false,
        miscLimits: false,
        maxClones: 300,
    });
    if (vm.setCompilerOptions) vm.setCompilerOptions({
        enabled: true,
        warpTimer: false
    });

    if (typeof ScaffoldingAddons !== 'undefined') {
        ScaffoldingAddons.run(scaffolding, { "gamepad": false, "pointerlock": false, "specialCloudBehaviors": false, "unsafeCloudBehaviors": false, "pause": false });
    }

    scaffolding.setExtensionSecurityManager({
        getSandboxMode: 'unsandboxed',
        canLoadExtensionFromProject: (url) => {
            handleError(new Error('Missing custom extension: ' + url));
            return Promise.resolve(false);
        }
    });
    for (const extension of []) {
        vm.extensionManager.loadExtensionURL(extension);
    }

} catch (e) {
    handleError(e);
}