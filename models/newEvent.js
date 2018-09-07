module.exports = function NewEvent(oldNewEvent) {
    this.items = oldNewEvent.items || {};
    this.totalQty = oldNewEvent.totalQty || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0};
        }
        storedItem.qty++;
        this.totalQty++;
    };

    this.removeItem = function(id) {
        this.totalQty = this.items[id].qty;
        delete this.items[id];
    };

    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};
