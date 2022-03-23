#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_rez;
uniform sampler2D tex0;

void main(){
  vec2 uv = gl_FragCoord.xy / u_rez.xy;
  uv.y = 1.0 - uv.y;

  const float Pi = 6.28318530718; // Pi*2


  const float directions = 70.0;
  const float quality = 20.0;
  const float size = 60.0;

  vec2 radius = size/u_rez.xy;

  vec4 col = texture2D(tex0,uv);

  for(float d=0.0; d<Pi; d+=Pi/directions){
		for(float i=1.0/quality; i<=1.0; i+=1.0/quality){
      col += texture2D(tex0, uv+vec2(cos(d),sin(d))*radius*i);
    }
  }

  col /= quality * directions;

  float b = (col.x + col.y + col.z)/3.0;
  float t = .7;
  float w = .015;
  float m = smoothstep(t,t+w,b);
  vec3 mycol = vec3(m);
  // vec4 tex = texture2D(tex0,uv);
  gl_FragColor = vec4(mycol,1.0);
  // gl_FragColor = col;
}
