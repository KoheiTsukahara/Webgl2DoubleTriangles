// script.js

"use strict";

let vertexShaderSource = `#version 300 es

in vec4 position;
in vec4 color;
out vec4 vcolor;

void main() {

   vcolor = color;

  // gl_Positionは必須
  // out変数としての定義不要
  gl_Position = position;
}
`;

let fragmentShaderSource = `#version 300 es

// データ型指定必須
precision highp float;

// フラグメントシェーダーは最終的なout変数を定義する必要あり
in vec4 vcolor;
out vec4 outColor;

void main() {
  outColor = vcolor;
}
`;

function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
  gl.deleteShader(shader);
  return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
  gl.deleteProgram(program);
  return undefined;
}

function main() {
  // コンテクスト取得
  let canvas = document.querySelector("canvas");
  let gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  
  // バーテックスシェーダーとフラグメントシェーダーをコンパイル
  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  // バーテックスシェーダーとフラグメントシェーダーをプログラムとリンクする
  let program = createProgram(gl, vertexShader, fragmentShader);
  
  /******************************************************************************** */
  gl.bindAttribLocation(program, 0, "position");
  gl.bindAttribLocation(program, 1, "color");
  
 
  const tri1 = [
    // x, y, z 
    1, 1, 0, 
    -1, -1, 0,
    1, -1, 0,
    0, 0.75, 0, 1, 
    0, 0.75, 0, 1,
    // Right Down
    0, 1, 0, 1
  ];
  
  const tri2 = [
    // x, y, z, r, g, b, a
    -1, 1, 0, 
    -1, -1, 0,
    1, 1, 0,
    // r, g, b, a
    // Left Up
    0, 0.5, 0, 1, 
    0, 0.75, 0, 1,
    0, 0.75, 0, 1
  ];

  let vao1 = gl.createVertexArray();
  prepare(gl, program, "position", 3, tri1, 0, 0, vao1);
  prepare(gl, program, "color", 4, tri1, 0, 4*9, vao1);
  
  let vao2= gl.createVertexArray();
  prepare(gl, program, "position", 3, tri2, 0, 0, vao2);
  prepare(gl, program, "color", 4, tri2, 0, 4*9, vao2);
    


  // キャンバスいっぱいをクリップ空間とする
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // キャンバスクリア
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);


  draw(gl, program, vao1);
  draw(gl, program, vao2);
}

function draw(gl, program, vao)
{

  // レンダリングに使用するシェーダープログラムを指定
  gl.useProgram(program);

  // レンダリングするVAOを指定
  gl.bindVertexArray(vao);

  // レンダリング
  let primitiveType = gl.TRIANGLES;
  let first = 0;
  let count = 3;
  gl.drawArrays(primitiveType, first, count);
}

function prepare(gl, program, varName, _size, data, _stride, _offset, vao)
{
  // VBOの設定
  let indexOfVbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, indexOfVbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  

  // VAOの設定
  let attributeLocation = gl.getAttribLocation(program, varName);
  gl.bindVertexArray(vao);

  // VBO & VAOの設定
  let size = _size;         
  let type = gl.FLOAT;   
  let normalize = false; 
  let stride = _stride;        
  let offset = _offset;        
  gl.vertexAttribPointer(
      attributeLocation, 
      size, 
      type, 
      normalize, 
      stride, 
      offset
  );
  gl.enableVertexAttribArray(attributeLocation);

}

main();