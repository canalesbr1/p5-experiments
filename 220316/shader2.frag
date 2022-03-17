#ifdef GL_ES
precision mediump float;
#endif

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}


uniform vec2 u_rez;
uniform sampler2D tex1;
uniform float mytime;
//varying vec2 vTexCoord; //without uniform using TexCoord

void main(){
  vec2 coord = gl_FragCoord.xy;
  vec2 st = coord.xy/u_rez.xy;
  st.y = 1.0 - st.y;

  vec4 tex = texture2D(tex1,st);
  vec3 c = rgb2hsv(tex.xyz);
  //c.y =0.0;
  float s = (sin(c.x*c.y*c.z*15.0+mytime*2.0)+1.0)*.5;
  s*= smoothstep(0.0,.3,c.y);

  //c.z *= s;
  c.y = 0.0;
  c = hsv2rgb(c);

  // vec3 col2 = vec3(0.95,0.925,0.875);
  // vec3 col1 = vec3(1.0,0.2,0.0);
  vec3 col2 = vec3(0.);
  vec3 col1 = vec3(.95);

  c = mix(col1,col2,s);
  gl_FragColor = vec4(c,tex.w);
  //gl_FragColor = tex;
}
