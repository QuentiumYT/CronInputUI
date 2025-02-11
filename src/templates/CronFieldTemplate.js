export function CronFieldTemplateGenerator(objLang) {
    return `
<form>
    <div style="display: flex; height: 138px;">
        <div class="panel panel-default" style="margin-right: 2.5px; width: 50%; height: 132px;">
            <div class="panel-heading">
                <label style="display: flex;">
                    <input class="propagationClass form-check-input" type="radio" name="choice" value="1" match="choice" checked>
                    <span style="margin-left: 10px">${objLang.frequencyChoice}</span>
                </label>
            </div>
            <div class="panel-body" style="display: flex;">
                <div class="propagationClass form-group" style="margin-right: 5px; width: 50%;">
                    <label for="everySelect">${objLang.every}</label>
                    <select match="every" class="form-control" style="width: 100%;">
                        <option>*</option>
                    </select>
                </div>
                <div class="form-group" style="margin-left: 5px; width: 50%;">
                    <label for="startSelect">${objLang.start}</label>
                    <select match="start" class="propagationClass form-control" style="width: 100%;">
                        <option>*</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="panel panel-default" style="margin-left: 2.5px; width: 50%; height: 132px;">
            <div class="panel-heading">
                <label style="display: flex;">
                    <input class="propagationClass form-check-input" type="radio" name="choice" value="2" match="choice">
                    <span style="margin-left: 10px;">${objLang.rangeChoice}</span>
                </label>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <div style="display: flex;">
                        <div style="width: 50%; margin-right: 5px;">
                            <label class="form-check-label" for="exampleRadios1">${objLang.min}</label>
                            <select match="rangeMin" class="propagationClass form-control" style="width: 100%;">
                            </select>
                        </div>
                        <div style="width: 50%; margin-right: 5px;">
                            <label class="form-check-label" for="exampleRadios1">${objLang.max}</label>
                            <select match="rangeMax" class="propagationClass form-control" style="width: 100%;">
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="panel panel-default" style="margin: 0px; padding: 0px; height: 214px;">
        <div class="panel-heading">
            <label style="display: flex;">
                <input class="propagationClass form-check-input" type="radio" name="choice" value="3" match="choice">
                <span style="margin-left: 10px;">${objLang.choice}</span>
            </label>
        </div>
        <div class="panel-body" style="padding-top: 6px;">
            <div match="specific" class="form-group" style="display: flex; flex-wrap: wrap; margin: 0px; padding: 0px;">
            </div>
        </div>
    </div>
</form>
    `;
}
