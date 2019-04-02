#!/bin/bash

source ./dev-tools/scripts/git/_core.sh
source ./_modules.sh

enforceBashVersion 4.4

debug=
mergeOriginRepo=
cloneNuArt=
pushNuArtMessage=

lib=
syncApp=

purge=
clean=

setup=
listen=
useFrontendHack=true
linkDependencies=
test=
build=true

serveBackend=
launchBackend=
launchFrontend=

envType=
prepareConfig=
setBackendConfig=
getBackendConfig=
deployBackend=
deployFrontend=

promoteNuArtVersion=
promoteAppVersion=
publish=

modulesPackageName=()
modulesVersion=()

params=(mergeOriginRepo cloneNuArt pushNuArtMessage purge clean setup lib syncApp useFrontendHack linkDependencies test build serveBackend launchBackend launchFrontend envType prepareConfig getBackendConfig setBackendConfig deployBackend deployFrontend version publish)

function printHelp() {
    local pc="${BBlue}"
    local group="${BCyan}"
    local param="${BPurple}"
    local err="${BRed}"
    local dc="${Green}"
    local dcb="${BGreen}"
    local noColor="${NoColor}"

    logVerbose " ==== ${group}CLEAN:${noColor} ===="
    logVerbose
    logVerbose "   ${pc}--purge${noColor}"
    logVerbose "        ${dc}Will delete the node_modules folder in all modules${noColor}"
    logVerbose "        ${dc}Will perform --clean{noColor}"
    logVerbose
    logVerbose "   ${pc}--clean${noColor}"
    logVerbose "        ${dc}Will delete the dist folder in all modules${noColor}"
    logVerbose
    logVerbose

    logVerbose " ==== ${group}BUILD:${noColor} ===="
    logVerbose
    logVerbose "   ${pc}--unlink${noColor}"
    logVerbose "        ${dc}Will purge & setup without dependencies${noColor}"
    logVerbose
    logVerbose "   ${pc}--setup${noColor}"
    logVerbose "        ${dc}Will link all modules and create link dependencies${noColor}"
    logVerbose
    logVerbose "   ${pc}--no-build${noColor}"
    logVerbose "        ${dc}Skip the build${noColor}"
    logVerbose
    logVerbose "   ${pc}--no-frontend-hack${noColor}"
    logVerbose "        ${dc}Do not apply the frontend development hack${noColor}"
    logVerbose
    logVerbose "   ${pc}--listen${noColor}"
    logVerbose "        ${dc}listen and rebuild on changes in modules${noColor}"
    logVerbose
    logVerbose "   ${pc}--test${noColor}"
    logVerbose "        ${dc}Run tests in all modules${noColor}"
    logVerbose
    logVerbose

    logVerbose " ==== ${group}LAUNCH:${noColor} ===="
    logVerbose
    logVerbose "   ${pc}--launch${noColor}"
    logVerbose "        ${dc}Will launch both frontend & backend${noColor}"
    logVerbose
    logVerbose "   ${pc}--launch-frontend${noColor}"
    logVerbose "        ${dc}Will launch ONLY frontend${noColor}"
    logVerbose
    logVerbose "   ${pc}--launch-backend${noColor}"
    logVerbose "        ${dc}Will launch ONLY backend${noColor}"
    logVerbose
    logVerbose "   ${pc}--serve-backend${noColor}"
    logVerbose "        ${dc}Will serve ONLY backend${noColor}"
    logVerbose
    logVerbose

    logVerbose " ==== ${group}DEPLOY:${noColor} ===="
    logVerbose
    logVerbose "   ${pc}--deploy${noColor}"
    logVerbose "        ${dc}Will deploy both frontend & backend${noColor}"
    logVerbose
    logVerbose "   ${pc}--deploy-frontend${noColor}"
    logVerbose "        ${dc}Will deploy ONLY frontend${noColor}"
    logVerbose
    logVerbose "   ${pc}--deploy-backend${noColor}"
    logVerbose "        ${dc}Will deploy ONLY backend${noColor}"
    logVerbose
    logVerbose "   ${pc}--prepare-config${noColor}"
    logVerbose "        ${dc}Will prepare the .config.json as base64 for local usage${noColor}"
    logVerbose
    logVerbose "   ${pc}--set-env=<${param}envType${pc}>${noColor}"
    logVerbose "        ${dc}Will set the .config-\${envType}.json as the current .config.json and prepare it as base 64 for local usage${noColor}"
    logVerbose
    logVerbose "   ${pc}--set-backend-config${noColor}"
    logVerbose "        ${dc}Will set function backend config${noColor}"
    logVerbose
    logVerbose "   ${pc}--get-backend-config${noColor}"
    logVerbose "        ${dc}Will get function backend config${noColor}"
    logVerbose
    logVerbose

    logVerbose " ==== ${group}PUBLISH:${noColor} ===="
    logVerbose
    logVerbose "   ${pc}--version-nu-art=< ${param}major${noColor} | ${param}minor${noColor} | ${param}patch${noColor} >${noColor}"
    logVerbose "        ${dc}Promote nu-art dependencies version${noColor}"
    logVerbose
    logVerbose "   ${pc}--version-app=< ${param}major${noColor} | ${param}minor${noColor} | ${param}patch${noColor} >${noColor}"
    logVerbose "        ${dc}Promote app dependencies version${noColor}"
    logVerbose
    logVerbose "   ${pc}--publish${noColor}"
    logVerbose "        ${dc}Publish artifacts to npm${noColor}"
    logVerbose

    logVerbose " ==== ${group}SUPER:${noColor} ===="
    logVerbose
    logVerbose "   ${pc}--merge-origin"
    logVerbose "        ${dc}Pull and merge from the forked repo${noColor}"
    logVerbose
    logVerbose "   ${pc}--nu-art${noColor}"
    logVerbose "        ${dc}Add dependencies sources${noColor}"
    logVerbose

    exit 0
}

function signature() {
    clear
    logVerbose
    logVerbose "${Gray} -------        _   __                      ___         __ ${Purple}            ${Gray}   ------- ${NoColor}"
    logVerbose "${Gray} -------       / | / /_  __                /   |  _____/ /_${Purple}            ${Gray}   ------- ${NoColor}"
    logVerbose "${Gray} -------      /  |/ / / / /    ______     / /| | / ___/ __/${Purple}    .   __  ${Gray}   ------- ${NoColor}"
    logVerbose "${Gray} -------     / /|  / /_/ /    /_____/    / ___ |/ /  / /_ ${Purple}    /|  /  \ ${Gray}   ------- ${NoColor}"
    logVerbose "${Gray} -------    /_/ |_/\__,_/               /_/  |_/_/   \__/ ${Purple} \/  |. \__/ ${Gray}   ------- ${NoColor}"
    logVerbose "${Gray} -------                                                  ${Purple}             ${Gray}   ------- ${NoColor}"
    logVerbose
    sleep 1s
}

function extractParams() {
    for paramValue in "${@}"; do
        case "${paramValue}" in
            "--help")
                printHelp
            ;;

            "--debug")
                debug=true
            ;;

            "--merge-origin")
                mergeOriginRepo=true
            ;;

            "--nu-art")
                cloneNuArt=true
            ;;

            "--push="*)
                pushNuArtMessage=`echo "${paramValue}" | sed -E "s/--push=(.*)/\1/"`
            ;;

#        ==== Frontend Hack =====
            "--lib="*)
                compileLib=`echo "${paramValue}" | sed -E "s/--lib=(.*)/\1/"`
            ;;

            "--sync-app="*)
                syncApp=`echo "${paramValue}" | sed -E "s/--sync-app=(.*)/\1/"`
            ;;


#        ==== CLEAN =====
            "--purge")
                purge=true
                clean=true
            ;;

            "--clean")
                clean=true
            ;;


#        ==== BUILD =====
            "--setup" | "-s")
                setup=true
                linkDependencies=true
            ;;

            "--unlink" | "-u")
                setup=true
            ;;

            "--no-build" | "-nb")
                build=
            ;;

            "--test" | "-t")
                test=true
            ;;

            "--listen" | "-l")
                listen=true
                build=
            ;;

            "--no-frontend-hack" | "-nfh")
                useFrontendHack=
            ;;


#        ==== DEPLOY =====
            "--deploy" | "-d")
                deployBackend=true
                deployFrontend=true
            ;;

            "--deploy-backend" | "-db")
                deployBackend=true
            ;;

            "--deploy-frontend" | "-df")
                deployFrontend=true
            ;;

            "--set-env="* | "-se="*)
                envType=`echo "${paramValue}" | sed -E "s/(--set-env=|-se=)(.*)/\2/"`
                prepareConfig=true
            ;;

            "--set-backend-config" | "-sbc")
                envType=`echo "${paramValue}" | sed -E "s/(--set-backend-config=|-scb=)(.*)/\2/"`
                prepareConfig=true
                setBackendConfig=true
                build=
            ;;

            "--get-backend-config" | "-gbc")
                getBackendConfig=true
                build=
            ;;

#        ==== LAUNCH =====
            "--launch" | "-l")
                launchBackend=true
                launchFrontend=true
            ;;

            "--serve-backend" | "-sb")
                serveBackend=true
            ;;

            "--launch-backend" | "-lb")
                launchBackend=true
            ;;

            "--launch-frontend" | "-lf")
                launchFrontend=true
            ;;

#        ==== PUBLISH =====
            "--publish" | "-p")
                clean=true
                build=true
                publish=true
            ;;

            "--version-nu-art="* | "-vn="*)
                promoteNuArtVersion=`echo "${paramValue}" | sed -E "s/(--version-nu-art=|-vn=)(.*)/\2/"`
                setup=true
                linkDependencies=true
            ;;

            "--version-app="* | "-va="*)
                promoteAppVersion=`echo "${paramValue}" | sed -E "s/(--version-app=|-va=)(.*)/\2/"`
                setup=true
                linkDependencies=true
            ;;

#        ==== ERRORS & DEPRECATION =====
            "--get-config-backend"*)
                logWarning "COMMAND IS DEPRECATED... USE --get-backend-config"
            ;;

            "-gcb")
                logWarning "COMMAND IS DEPRECATED... USE -gbc"
            ;;

            "--set-config-backend"*)
                logWarning "COMMAND IS DEPRECATED... USE --set-backend-config"
            ;;

            "-scb"*)
                logWarning "COMMAND IS DEPRECATED... USE -sbc"
            ;;

            *)
                logWarning "UNKNOWN PARAM: ${paramValue}";
            ;;
        esac
    done
}

#################
#               #
#  DECLARATION  #
#               #
#################

function mapModulesVersions() {
    modulesPackageName=()
    modulesVersion=()
    executeOnModules mapModule
}

function mapExistingLibraries() {
    _modules=()
    local module
    for module in "${modules[@]}"; do
        if [[ ! -e "${module}" ]]; then continue; fi
        _modules+=(${module})
    done
    modules=("${_modules[@]}")
}

function purgeModule() {

    logInfo "Purge module: ${1}"
    rm -rf node_modules
    rm package-lock.json
}

function cleanModule() {
    cd dist
        rm -rf *
    cd ..
}

function usingBackend() {
    if [[ ! "${deployBackend}" ]] && [[ ! "${launchBackend}" ]] && [[ ! "${serveBackend}" ]]; then
        echo
        return
    fi

    echo true
}

function usingFrontend() {
    if [[ ! "${deployFrontend}" ]] && [[ ! "${launchFrontend}" ]]; then
        echo
        return
    fi

    echo true
}

function buildModule() {
    local module=${1}

    if [[ `usingFrontend` ]] && [[ ! `usingBackend` ]] && [[ "${module}" == "${backendModule}" ]]; then
        return
    fi

    if [[ `usingBackend` ]] && [[ ! `usingFrontend` ]] && [[ "${module}" == "${frontendModule}" ]]; then
        return
    fi

    compileModule ${module}
}

function testModule() {
    npm run test
}

function linkDependenciesImpl() {
    local module=${1}
    logVerbose
    logInfo "Linking dependencies sources to: ${module}"

    local i
    for (( i=0; i<${#modules[@]}; i+=1 )); do
        if [[ "${module}" == "${modules[${i}]}" ]];then break; fi

        if [[ `contains "${modules[${i}]}" "${projectModules[@]}"` ]]; then
            return
        fi

        local modulePackageName="${modulesPackageName[${i}]}"
        if [[ ! "`cat package.json | grep ${modulePackageName}`" ]]; then
            continue;
        fi

#        if [[ "${module}" == "${frontendModule}" ]] && [[ "${useFrontendHack}" ]]; then
#            logInfo "Sync ${modules[${i}]} => ${module}"
#            cd ..
#                bash build-and-install.sh --lib=${modules[${i}]} --sync-app=${module}
#            cd -
#        else

        logInfo "Linking ${modules[${i}]} (${modulePackageName}) => ${module}"
        local target="`pwd`/node_modules/${modulePackageName}"
        local origin="`pwd`/../${modules[${i}]}/dist"

        createDir ${target}
        if [[ -e "${target}" ]]; then
            rm -rf ${target}
            throwError "Error deleting older dependency symlink: ${modulePackageName}" $?
        fi

        logDebug "ln -s ${origin} ${target}"
        ln -s ${origin} ${target}
        throwError "Error symlink dependency: ${modulePackageName}" $?

#        fi

        local moduleVersion="${modulesVersion[${i}]}"
        if [[ ! "${moduleVersion}" ]]; then continue; fi

        logDebug "Updating dependency version to ${modulePackageName} => ${moduleVersion}"
        local escapedModuleName=${modulePackageName/\//\\/}
        sed -i '' "s/\"${escapedModuleName}\": \".*\"/\"${escapedModuleName}\": \"^${moduleVersion}\"/g" package.json
        throwError "Error updating version of dependency in package.json" $?
    done
}

function backupPackageJson() {
    cp package.json _package.json
    throwError "Error backing up package.json in module: ${1}" $?
}

function restorePackageJson() {
    rm package.json
    throwError "Error restoring package.json in module: ${1}" $?

    mv _package.json package.json
    throwError "Error restoring package.json in module: ${1}" $?
}

function setupModule() {
    local module=${1}

    function cleanPackageJson() {
        local i
        for (( i=0; i<${#modules[@]}; i+=1 )); do
            if [[ "${module}" == "${modules[${i}]}" ]]; then break; fi

            local moduleName="${modulesPackageName[${i}]}"
            local escapedModuleName=${moduleName/\//\\/}

            if [[ `isMacOS` ]]; then
                sed -i '' "/${escapedModuleName}/d" package.json
            else
                sed -i "/${escapedModuleName}/d" package.json
            fi
        done
    }

    if [[ "${linkDependencies}" ]]; then
        backupPackageJson
        cleanPackageJson
    fi

    trap 'restorePackageJson' SIGINT
        logVerbose
        logInfo "Installing ${module}"
        logVerbose
        npm install
        throwError "Error installing module" $?
    trap - SIGINT

    if [[ "${linkDependencies}" ]]; then
        restorePackageJson
        linkDependenciesImpl $@
    fi
}

function executeOnModules() {
    local toExecute=${1}
    local async=${2}

    local i
    for (( i=0; i<${#modules[@]}; i+=1 )); do
        local module="${modules[${i}]}"
        local packageName="${modulesPackageName[${i}]}"
        local version="${modulesVersion[${i}]}"
        if [[ ! -e "./${module}" ]]; then continue; fi

        cd ${module}
            if [[ "${async}" == "true" ]]; then
                ${toExecute} ${module} ${packageName} ${version} &
            else
                ${toExecute} ${module} ${packageName} ${version}
            fi
        cd ..
    done
}

function getModulePackageName() {
    local packageName=`cat package.json | grep '"name":' | head -1 | sed -E "s/.*\"name\".*\"(.*)\",?/\1/"`
    echo "${packageName}"
}

function getModuleVersion() {
    local version=`cat package.json | grep '"version":' | head -1 | sed -E "s/.*\"version\".*\"(.*)\",?/\1/"`
    echo "${version}"
}

function mapModule() {
    local packageName=`getModulePackageName`
    local version=`getModuleVersion`
    modulesPackageName+=(${packageName})
    modulesVersion+=(${version})
}

function printModule() {
    local output=`printf "Found: %-15s %-20s  %s\n" ${1} ${2} v${3}`
    logDebug "${output}"
}

function cloneNuArtModules() {
    local module
    for module in "${nuArtModules[@]}"; do
        if [[ ! -e "${module}" ]]; then
            git clone git@github.com:nu-art-js/${module}.git
        else
            cd ${module}
                git pull
            cd ..
        fi
    done
}

function mergeFromFork() {
    local repoUrl=`gitGetRepoUrl`
    if [[ "${repoUrl}" == "${boilerplateRepo}" ]]; then
        throwError "HAHAHAHA.... You need to be careful... this is not a fork..."
    fi

    logInfo "Making sure repo is clean..."
    gitAssertRepoClean
    git remote add public ${boilerplateRepo}
    git fetch public
    git merge public/master
    throwError "Need to resolve conflicts...." $?

    git submodule update dev-tools
}

function pushNuArt() {
    for module in "${nuArtModules[@]}"; do
        if [[ ! -e "${module}" ]]; then
            throwError "In order to promote a version ALL nu-art dependencies MUST be present!!!"
        fi
    done

    for module in "${nuArtModules[@]}"; do
        cd ${module}
            gitNoConflictsAddCommitPush ${module} `gitGetCurrentBranch` "${pushNuArtMessage}"
        cd ..
    done
}
function deriveVersion() {
    local _version=${1}
    case "${_version}" in
        "patch" | "minor" | "major")
            echo ${_version}
            return
        ;;

        "p")
            echo "patch"
            return
        ;;

        *)
            echo
            return
        ;;
    esac

    if [[ ! "${_version}" ]]; then
        throwError "Bad version type: ${promoteNuArtVersion}"
    fi

}

function promoteNuArt() {
    local _version=`deriveVersion ${promoteNuArtVersion}`
    for module in "${nuArtModules[@]}"; do
        if [[ ! -e "${module}" ]]; then
            throwError "In order to promote a version ALL nu-art dependencies MUST be present!!!"
        fi

        cd ${module}
            gitAssertBranch master
            gitAssertRepoClean
        cd ..
    done

    for module in "${nuArtModules[@]}"; do
        cd ${module}
            logInfo "updating module: ${module} version: ${_version}"
            setupModule ${module}
            gitNoConflictsAddCommitPush ${module} `gitGetCurrentBranch` "updated dependencies version"
            npm version ${_version}
            throwError "Error promoting version" $?
        cd ..

        mapModulesVersions
    done
}

function promoteApps() {
    throwError "Promote app version - WIP"

    local _version=`deriveVersion ${promoteAppVersion}`
    gitAssertRepoClean
    gitAssertBranch master

    for module in "${projectModules[@]}"; do
        cd ${module}
            logInfo "updating module: ${module} version: ${_version}"
            gitNoConflictsAddCommitPush ${module} `gitGetCurrentBranch` "updated dependencies version"
            npm version ${_version}
        cd ..

        mapModulesVersions
    done
}

function publishNuArt() {
    for module in "${nuArtModules[@]}"; do
        cd ${module}
            logInfo "publishing module: ${module}"
            cp package.json dist/
            cd dist
                npm publish --access public
            cd ..
            throwError "Error publishing module: ${module}" $?
        cd ..
    done
}

function getFirebaseConfig() {
    logInfo "Fetching config for serving function locally..."
    firebase functions:config:get > .runtimeconfig.json
}

function prepareConfigImpl() {
    cd ${backendModule}
        if [[ -e ".example-config.json" ]] && [[ ! -e ".config.json" ]]; then
            logInfo "Setting first time .config.json"
            mv .example-config.json .config.json

            if [[ ! -e ".config-dev.json" ]]; then
                cp .config.json .config-dev.json
            fi
            if [[ ! -e ".config-prod.json" ]]; then
                cp .config.json .config-prod.json
            fi
        fi

        if [[ "${envType}" ]] && [[ -e ".config-${envType}.json" ]]; then
            logInfo "Setting to backend envType: ${envType}"
            cp -f ".config-${envType}.json" .config.json
        fi

        logInfo "Preparing config as base64..."
        local configAsJson=`cat .config.json`
        configAsBase64=

        if [[ `isMacOS` ]]; then
            configAsBase64=`echo "${configAsJson}" | base64 --break 0`
            throwError "Error base64 config" $?
        else
            configAsBase64=`echo "${configAsJson}" | base64 --wrap=0`
            throwError "Error base64 config" $?
        fi

        echo "{\"app\": {\"config\":\"${configAsBase64}\"}}" > .runtimeconfig.json
        logInfo "Backend Config is ready as base64!"
    cd -

    cd ${frontendModule}/src/main
        if [[ "${envType}" ]] && [[ -e "config-${envType}.ts" ]]; then
            logInfo "Setting to frontend envType: ${envType}"
            cp -f "config-${envType}.ts" config.ts
        fi
        logInfo "Frontend config is set!"
    cd -
}

function updateBackendConfig() {
    if [[ ! "${configAsBase64}" ]]; then
        throwError "config was not prepared!!"
    fi

    cd ${backendModule}
        logInfo "Updating config in firebase..."
        firebase functions:config:set ${configEntryName}="${configAsBase64}"
        throwError "Error Updating config as base 64 in firebase..." $?

        getFirebaseConfig
    cd ..
    throwError "Error while deploying functions" $?
}

function fetchBackendConfig() {
    cd ${backendModule}
        getFirebaseConfig

        logInfo "Updating config locally..."
        local configAsBase64=`firebase functions:config:get ${configEntryName}`
        configAsBase64=${configAsBase64:1:-1}
        local configEntry=`echo ${configAsBase64} | base64 --decode`
        echo "${configEntry}" > .config.json
    cd ..
    throwError "Error while deploying functions" $?
}

function compileModule() {
    local compileLib=${1}
    logVerbose
    logInfo "${compileLib} - Compiling..."
    npm run build
    throwError "Error compiling:  ${compileLib}" $?

    cp package.json dist/
    logInfo "${compileLib} - Compiled!"
}


#################
#               #
#    PREPARE    #
#               #
#################

# Handle recursive sync execution
if [[ ! "${1}" =~ "--lib" ]]; then
    signature
    printCommand "$@"
fi

extractParams "$@"

if [[ "${compileLib}" ]]; then
    cd ${compileLib}
        compileModule ${compileLib}
    cd ..

    exit $?
fi

printDebugParams ${debug} "${params[@]}"


#################
#               #
#   EXECUTION   #
#               #
#################

if [[ "${#modules[@]}" == 0 ]]; then
    modules+=(${nuArtModules[@]})
    modules+=(${projectModules[@]})
fi

if [[ "${mergeOriginRepo}" ]]; then
    mergeFromFork
    logInfo "Merged from origin boilerplate... DONE"
    exit 0
fi

if [[ "${cloneNuArt}" ]]; then
    cloneNuArtModules
    bash $0 --setup
fi

mapExistingLibraries
mapModulesVersions
executeOnModules printModule

if [[ "${purge}" ]]; then
    executeOnModules purgeModule
fi

if [[ "${clean}" ]]; then
    executeOnModules cleanModule
fi

if [[ "${prepareConfig}" ]]; then
    prepareConfigImpl
fi

if [[ "${setBackendConfig}" ]]; then
    updateBackendConfig
fi

if [[ "${getBackendConfig}" ]]; then
    fetchBackendConfig
fi

if [[ "${setup}" ]]; then
    executeOnModules setupModule
fi

if [[ "${build}" ]]; then
    executeOnModules buildModule
fi

if [[ "${test}" ]]; then
    executeOnModules testModule
fi

if [[ "${launchBackend}" ]]; then
    cd ${backendModule}
        if [[ "${launchFrontend}" ]]; then
            node ./dist/index.js &
        else
            node ./dist/index.js
        fi
    cd ..
fi

if [[ "${serveBackend}" ]]; then
    cd ${backendModule}

        npm run serve
    cd ..
fi

if [[ "${launchFrontend}" ]]; then
    cd ${frontendModule}
        if [[ "${launchBackend}" ]]; then
            npm run dev &
        else
            npm run dev
        fi
    cd ..
fi

if [[ "${deployBackend}" ]]; then
    firebase deploy --only functions
    throwError "Error while deploying functions" $?
fi

if [[ "${deployFrontend}" ]]; then
    firebase deploy --only hosting
    throwError "Error while deploying hosting" $?
fi

if [[ "${pushNuArtMessage}" ]]; then
    pushNuArt
fi

if [[ "${promoteNuArtVersion}" ]]; then
    gitAssertOrigin "${boilerplateRepo}"
    promoteNuArt
fi

if [[ "${promoteAppVersion}" ]]; then
    promoteApps
fi

if [[ "${publish}" ]]; then
    gitAssertOrigin "${boilerplateRepo}"
    publishNuArt
    executeOnModules setupModule
    gitNoConflictsAddCommitPush ${module} `gitGetCurrentBranch` "built with new dependencies version"
fi

if [[ "${listen}" ]]; then
    logDebug "Stop all fswatch listeners..."
    killall 9 fswatch
    pids=()

    for module in ${modules[@]}; do
        if [[ ! -e "./${module}" ]]; then continue; fi

        logInfo "Watching on: ${module}/src => bash build-and-install.sh --lib=${module}"
        fswatch -o -0 ${module}/src | xargs -0 -n1 -I{} bash build-and-install.sh --lib=${module} &
        pids+=($!)
    done

    for pid in "${pids[@]}"; do
        wait ${pid}
    done
fi

