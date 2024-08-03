/**
 * @name ServersPanel
 * @author Quad
 * @description Replaces the usual server list with a comfortable panel that opens when hovering the cursor
 * @version 0.0.1
 * @source https://github.com/quad58/ServersPanelPlugin
 * @invite AmwzWySsRb
 */

var styles = `
@import url("https://quad58.github.io/ServersPanelTheme/main.css");

:root {
    --qsp-rows: {rows};
    --qsp-columns: {columns};
    --qsp-grid-flow: {gridFlow};

    --qsp-animation-duration: {animationDuration}s;
    --qsp-animation-delay: {animationDelay}ms;
}

.qsp_settingWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
}

.qsp_settingLabel {
    padding-top: 8px;
    padding-bottom: 8px;
    font-weight: 600;
    display: inline-block;
    color: var(--text-normal);
    min-width: 30%;
}

.qsp_settingContent {
    display: inline-block;
    width: 70%;
}

.qsp_select {
    background-color: var(--input-background);
    font-size: 14px;
}

.qsp_rangeLabel {
    display: inline-block;
    color: var(--text-normal);
    width: 80px;
    text-align: right;
}

.qsp_rangeLabelWrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.qsp_range {
    display: inline-block;
    margin: 0;
    width: calc(100% - 80px);
    vertical-align: middle;
}
`;

module.exports = meta => {

    var styleSheet;

    const settings = {
        gridFlow: 1,
        columns: 5,
        animationDuration: 0.1,
        animationDelay: 75
    }

    function updateStyleSheet()
    {
        styleSheet.textContent = styles
            .replace("{gridFlow}", settings.gridFlow == 0 ? "row" : "column")
            .replace("{rows}", Math.ceil((document.getElementsByClassName("listItem_c96c45").length - 4) / settings.columns).toFixed())
            .replace("{columns}", settings.columns)
            .replace("{animationDuration}", settings.animationDuration)
            .replace("{animationDelay}", settings.animationDelay);
    }

    function buildSetting(name, content)
    {
        const wrapper = document.createElement("div");
        wrapper.className = "qsp_settingWrapper";

        const label = document.createElement("span");
        label.className = "qsp_settingLabel";
        label.textContent = name;
        wrapper.append(label);

        wrapper.append(content);

        return wrapper;
    }

    function saveSettings()
    {
        BdApi.Data.save(meta.name, "settings", settings);
    }

    function loadSettings()
    {
        Object.assign(settings, BdApi.Data.load(meta.name, "settings"));
    }

    function gridFlowSettingChanged(target)
    {
        settings.gridFlow = target.target.selectedIndex;
        updateStyleSheet();
        saveSettings();
    }

    function columnsSettingInput(target)
    {
        document.getElementById("qsp_columnsRangeLabel").textContent = target.target.value;
    }

    function columnsSettingChanged(target)
    {
        settings.columns = target.target.value;
        document.getElementById("qsp_columnsRangeLabel").textContent = target.target.value;
        updateStyleSheet();
        saveSettings();
    }

    function animDurationSettingInput(target)
    {
        document.getElementById("qsp_animDurationRangeLabel").textContent = target.target.value + "ms";
    }

    function animDurationSettingChanged(target)
    {
        settings.animationDuration = target.target.value / 1000;
        document.getElementById("qsp_animDurationRangeLabel").textContent = target.target.value + "ms";
        updateStyleSheet();
        saveSettings();
    }

    function animDelaySettingInput(target)
    {
        document.getElementById("qsp_animDelayRangeLabel").textContent = target.target.value + "ms";
    }

    function animDelaySettingChanged(target)
    {
        settings.animationDelay = target.target.value;
        document.getElementById("qsp_animDelayRangeLabel").textContent = target.target.value + "ms";
        updateStyleSheet();
        saveSettings();
    }

    return {
        start: () => {
            loadSettings();

            styleSheet = document.createElement("style");
            document.head.appendChild(styleSheet);

            updateStyleSheet();
        },
        stop: () => {
            styleSheet.remove();
        },
        getSettingsPanel: () => {
            loadSettings();
            updateStyleSheet();

            const settingsPanel = document.createElement("div");
    
            // Grid flow setting
            const gridFlowSelect = document.createElement("select");
            gridFlowSelect.classList.add("select_f6639d");
            gridFlowSelect.classList.add("qsp_select");
            gridFlowSelect.classList.add("qsp_settingContent");

            const gridFlowOption = document.createElement("option");
            gridFlowOption.textContent = "Rows";
            const gridFlowOption2 = document.createElement("option");
            gridFlowOption2.textContent = "Columns";
            gridFlowSelect.append(gridFlowOption, gridFlowOption2);

            gridFlowSelect.onchange = gridFlowSettingChanged;
            gridFlowSelect.selectedIndex = settings.gridFlow;
    
            settingsPanel.append(buildSetting("Grid flow", gridFlowSelect));

            // Columns setting
            const columsRangeWrapper = document.createElement("span");
            columsRangeWrapper.classList.add("qsp_rangeLabelWrapper");
            columsRangeWrapper.classList.add("qsp_settingContent");

            const columsRange = document.createElement("input");
            columsRange.type = "range";
            columsRange.min = 1;
            columsRange.max = 20;
            columsRange.classList.add("qsp_range");

            columsRange.oninput = columnsSettingInput;
            columsRange.onchange = columnsSettingChanged;
            columsRange.value = settings.columns;
    
            const columsRangeLabel = document.createElement("span");
            columsRangeLabel.textContent = settings.columns;
            columsRangeLabel.classList.add("qsp_rangeLabel");
            columsRangeLabel.id = "qsp_columnsRangeLabel";
            
            columsRangeWrapper.append(columsRange, columsRangeLabel);
    
            settingsPanel.append(buildSetting("Columns count", columsRangeWrapper));

            // Animation duration setting
            const animDurationRangeWrapper = document.createElement("span");
            animDurationRangeWrapper.classList.add("qsp_rangeLabelWrapper");
            animDurationRangeWrapper.classList.add("qsp_settingContent");

            const animDurationRange = document.createElement("input");
            animDurationRange.type = "range";
            animDurationRange.min = 0;
            animDurationRange.max = 2000;
            animDurationRange.classList.add("qsp_range");

            animDurationRange.oninput = animDurationSettingInput;
            animDurationRange.onchange = animDurationSettingChanged;
            animDurationRange.value = settings.animationDuration * 1000;
    
            const animDurationRangeLabel = document.createElement("span");
            animDurationRangeLabel.textContent = settings.animationDuration * 1000 + "ms";
            animDurationRangeLabel.classList.add("qsp_rangeLabel");
            animDurationRangeLabel.id = "qsp_animDurationRangeLabel";
            
            animDurationRangeWrapper.append(animDurationRange, animDurationRangeLabel);
    
            settingsPanel.append(buildSetting("Animation duration", animDurationRangeWrapper));

            // Animation delay setting
            const animDelayRangeWrapper = document.createElement("span");
            animDelayRangeWrapper.classList.add("qsp_rangeLabelWrapper");
            animDelayRangeWrapper.classList.add("qsp_settingContent");

            const animDelayRange = document.createElement("input");
            animDelayRange.type = "range";
            animDelayRange.min = 0;
            animDelayRange.max = 500;
            animDelayRange.classList.add("qsp_range");

            animDelayRange.oninput = animDelaySettingInput;
            animDelayRange.onchange = animDelaySettingChanged;
            animDelayRange.value = settings.animationDelay;
    
            const animDelayRangeLabel = document.createElement("span");
            animDelayRangeLabel.textContent = settings.animationDelay + "ms";
            animDelayRangeLabel.classList.add("qsp_rangeLabel");
            animDelayRangeLabel.id = "qsp_animDelayRangeLabel";
            
            animDelayRangeWrapper.append(animDelayRange, animDelayRangeLabel);
    
            settingsPanel.append(buildSetting("Open delay", animDelayRangeWrapper));
    
            return settingsPanel;
        }
    }
}