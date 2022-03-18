#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_rez; //receive u_rez from .js sketch
uniform sampler2D tex0; //get texture from .js sketch
uniform vec2 mouse; //receive mouse from .js sketch
uniform vec2 dir; //receive dir from .js sketch
uniform float strength; //receive strength from .js sketch

void main(){
  vec2 uv = gl_FragCoord.xy/u_rez.xy; //normalize uv coordinates
  vec2 m = mouse.xy/u_rez.xy;
  uv.y = 1.0 - uv.y;
  float d = distance(uv,m);
  d = smoothstep(.03,.06,d);
  d = 1.0-d;
  uv.xy += dir.xy*.000055*d*strength;
  vec4 tex = texture2D(tex0,uv); //sample vec4 col values from tex0
  //vec3 g = vec3(uv.x,0.0,0.0);
  gl_FragColor = tex; //assign final color values
}
