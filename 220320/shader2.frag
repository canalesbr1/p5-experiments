#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_rez;
uniform sampler2D tex0;

void main(){
  vec2 uv = gl_FragCoord.xy/u_rez.xy;
  uv.y = 1.0 - uv.y;

  vec4 col = vec4(0,0,0,0);
  float cnt = 0.0;
  for(int i=-1;i<=1;i++){
    for(int j=-1;j<=1;j++){
      vec2 off = vec2(i,j)/u_rez.xy;
      vec2 ref = uv.xy + off.xy;
      vec4 mycol = texture2D(tex0,ref);
      col += mycol;
      cnt = cnt +1.0;
    }
  }

  col=col/cnt;

  //vec4 tex = texture2D(tex0,uv);
  col.xyz = vec3(1.0) - col.xyz - vec3(.035);
  //vec3 col = vec3(uv.y,0.0,0.0);

  gl_FragColor = vec4(col.xyz,1.0);

}
