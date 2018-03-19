var g_bitmap_canvas = null;
var g_2d_canvas = null;
var g_render_worker = null;
var g_angle = 30;

function main() {
  g_bitmap_canvas = helper.GetCanvas("bitmap");
  g_2d_canvas = helper.GetCanvas("2d");

  let window_size = helper.GetWindowSizeInPx();
  g_bitmap_canvas.width = window_size.width;
  g_bitmap_canvas.height = window_size.height / 2;

  g_2d_canvas.width = window_size.width;
  g_2d_canvas.height = window_size.height / 2;

  g_render_worker = new Worker("../common/render.js");
  g_render_worker.onmessage = function(msg) {
    console.log('Woker post:' + msg.data.name);

    if (msg.data.name === "TransferBuffer") {
      GetTransferBuffer(msg.data.buffer);
    }
  }

  g_render_worker.postMessage(
    {name:"Init", mode:"transfer",
      width:g_bitmap_canvas.width, height: g_bitmap_canvas.height});
}

function GetTransferBuffer(buffer) {
  let context_2d = g_2d_canvas.getContext("2d");
  context_2d.clearRect(0, 0, g_2d_canvas.width, g_2d_canvas.height);
  context_2d.save();
  context_2d.translate(g_bitmap_canvas.width / 2, g_bitmap_canvas.height / 2);
  context_2d.rotate(g_angle * Math.PI / 180);
  context_2d.scale(0.5, 0.5);
  context_2d.translate(-g_bitmap_canvas.width / 2, -g_bitmap_canvas.height / 2);
  context_2d.drawImage(buffer, 0, 0);
  context_2d.restore();

  g_angle += 15;
  if (g_angle > 360)
    g_angle = 0;

  let bitmap_context = g_bitmap_canvas.getContext("bitmaprenderer");
  bitmap_context.transferFromImageBitmap(buffer);
}