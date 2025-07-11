const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const path = require('path');

async function run() {
    try {
        const unityPath = core.getInput('unity-path') || process.env.UNITY_PATH;
        if (!unityPath) {
            throw new Error('unity path not found');
        }
        const projectPath = core.getInput('project-path');
        const buildTarget = core.getInput('build-target', { required: true });
        const buildVersion = core.getInput('build-version');
        const buildNumber = core.getInput('build-number');
        const buildDefines = core.getInput('build-defines');
        const buildOptions = core.getInput('build-options');
        const androidKeystorePath = core.getInput('android-keystore-path');
        const androidKeystorePass = core.getInput('android-keystore-pass');
        const androidKeyaliasName = core.getInput('android-keyalias-name');
        const androidKeyaliasPass = core.getInput('android-keyalias-pass');
        const buildMethodArgs = core.getInput('build-method-args');
        const buildSubTarget = core.getInput('build-sub-target');
        const buildCustomPlatform = core.getInput('build-custom-platform');
        const buildEnvironment = core.getInput('build-environment');
        const buildMethod = core.getInput('build-method');
        const noGraphics = core.getInput('no-graphics');
        const buildConfigPath = core.getInput('build-config');

        let unityCmd = '';
        if (process.platform === 'linux') {
            unityCmd = `xvfb-run --auto-servernum "${unityPath}"`;
        } else {
            unityCmd = `"${unityPath}"`;
        }

        let buildArgs = '';
        buildArgs += ` -projectPath "${projectPath}"`;
        buildArgs += ` -buildTarget "${buildTarget}"`;
        buildArgs += ` ${buildMethodArgs}`;
        if (buildVersion) {
            buildArgs += ` -buildVersion "${buildVersion}"`;
        }
        if (buildNumber) {
            buildArgs += ` -buildNumber "${buildNumber}"`;
        }
        if (buildDefines) {
            buildArgs += ` -buildDefines "${buildDefines}"`;
        }
        if (buildOptions) {
            buildArgs += ` -buildOptions "${buildOptions}"`;
        }
        if (androidKeystorePath) {
            buildArgs += ` -androidKeystorePath "${androidKeystorePath}"`;
        }
        if (androidKeystorePass) {
            buildArgs += ` -androidKeystorePass "${androidKeystorePass}"`;
        }
        if (androidKeyaliasName) {
            buildArgs += ` -androidKeyAliasName "${androidKeyaliasName}"`;
        }
        if (androidKeyaliasPass) {
            buildArgs += ` -androidKeyAliasPass "${androidKeyaliasPass}"`;
        }
        if (buildSubTarget){
            buildArgs += ` -standaloneBuildSubtarget "${buildSubTarget}"`;
        }
        if (buildCustomPlatform){
            buildArgs += ` -target "${buildCustomPlatform}"`;
        }
        if (buildEnvironment){
            buildArgs += ` -environment "${buildEnvironment}"`;
        }
        if (noGraphics && noGraphics.toUpperCase() === 'TRUE'){
            buildArgs += ` -nographics`;
        }
        if (buildConfigPath){
            buildArgs += ` -buildConfig "${buildConfigPath}"`;
        }

        if (buildMethod) {
            let prefix = ``;
            if (process.platform === 'win32') 
                prefix = `cmd /c `
            await exec.exec(`${prefix}${unityCmd} -quit -batchmode -logFile "-" ${buildArgs} -executeMethod "${buildMethod}"`);
        }
        else
            core.setFailed('Build Method is not provided');
            
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

