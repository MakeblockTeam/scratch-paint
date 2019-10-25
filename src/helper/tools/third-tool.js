class ThirdTool {
    constructor () {
        this.tools = {};
    }

    add (name, tool) {
        if (typeof name !== 'string') return;
        if (this.tools[name]) return;
        this.tools[name] = tool;
    }

    get (name) {
        return this.tools[name];
    }

    delete (name) {
        delete this.tools[name];
    }
}

export default new ThirdTool();
