const colors = ["#2f3640", "#795548", "#9c88ff", "#0097e6", "#fbc531", "#4cd137", "#273c75", "#7f8fa6"];
let slider;
let cnv;
let submit;
let drawing;
let qtree;
let buttons = [];

function setup() {
        cnv = createCanvas(500, 500)
        drawing = createGraphics(500, 450);
        cnv.parent("canvasContainer");
        cnv.mousePressed(mouseDragged);
        drawing.background("#f5f6fa");
        stroke(colors[0]);
        slider = createSlider(1, 20, 1, 1);
        submit = createButton("Submit");
        submit.mousePressed(() => {
                $.post({
                        url: "setimage",
                        data: `{"image": "${getData()}"}`,
                        contentType: 'application/json',
                        success: () => {
                                $.get({
                                        url: "image",
                                        success: (res) => createImg(res)
                                })
                        }
                });
        });
        qtree = new QuadTree(new Rectangle(width / 2, height / 2, width / 2, height / 2), 4);
        for (let i = 0; i < colors.length; i++) {
                color = colors[i];buttons.length,
                buttons.push({
                        color: color,
                        draw: ((color, i) => drawColor(color, i))
                })
        }
        buttons.push({
                color: "#f5f6fa",
                draw: (_, i) => drawEraser(i)
        });
        for(let i = 0; i < buttons.length; i++) {
                button = buttons[i];
                let point = new Point(map(i + 0.5, 0, buttons.length, 10, width - 10), height - 25);
                qtree.insert(point);
                button.point = point;
        }
}

const setColor = col => drawing.stroke(col);

const drawColor = (color, i) => {
        push();
        strokeWeight(4);
        stroke("#dcdde1");
        fill(color);
        const x = map(i + 0.5, 0, buttons.length, 10, width - 10);
        ellipse(x, height - 25, 25);
        pop();
}
let eraser;
const drawEraser = i => {
        const x = map(i + 0.75, 0, buttons.length, 10, width - 10);
        imageMode(CENTER);
        image(eraser, x, height - 25, 25, 25);
        imageMode(CORNER);
}

function preload() {
        eraser = loadImage("eraser-icon.png")
}

function draw() {
        background("#f5f6fa");
        image(drawing, 0, 0);
        for (let i = 0; i < buttons.length; i++) {
                buttons[i].draw(buttons[i].color, i);
        }
        drawing.strokeWeight(slider.value())
}

const getData = () => drawing.canvas.toDataURL();

function mousePressed() {
        const mouse = new Circle(mouseX, mouseY, 25);
        const button = qtree.query(mouse)[0];
        if (button)
                for (let but of buttons)
                        if (but.point.x == button.x) {
                                setColor(but.color);
                        }
}

function mouseDragged() {
        drawing.line(mouseX, mouseY, pmouseX, pmouseY);
}