register_namespace('util.random');


util.random.choice = function(arr, max) {
    if ((!max)||(arr.length<max)) {
        max = arr.length;
    }
    return arr[Math.floor(Math.random()*max)];
};


util.random.choice_similar = function(arr) {
    var sim = [];
    // Выбираем только похожие
    for (var i in arr) {
        if (parseFloat(arr[i].match) > 0.5) {
            sim.push(arr[i]);
        }
    }
    if (sim.length<10) {
        // Если таких мало, выбираем из 10 первых
        return this.choice(arr, 10);
    } else {
        // Иначе — из всех похожих
        return this.choice(sim);
    }
};


util.random.randint = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};