#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aPosition;

void main(){
  vec4 positionVec4 = vec4(aPosition, 1.0); //copy the pos attrib and set w as 1.0
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; //(remember upper right corner square) scale x & y by 2 and subtract 1
  gl_Position = positionVec4; //always last line to send to frag shader
}
