#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_rez;
uniform sampler2D tex0;
uniform float decay;

void main(){
  vec2 uv = gl_FragCoord.xy/u_rez.xy;
  uv.y = 1.0 - uv.y;

  ////////////////////// BLUR
  vec4 tex = texture2D(tex0,uv);
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

  col=mix(tex,col/cnt,.75);

  //col.xyz = vec3(smoothstep(0.0,.9,col.x));

  col.xyz = clamp(col.xyz - vec3(.0025),vec3(0.0),vec3(1.0));

  //////////////////// ADVECT

  // vec2 dir = vec2(0.0,0.0);
  // vec4 col = texture2D(tex0,uv);
  // float cnt = 0.0;
  //
  // for(int i=-1;i<=1;i++){
  //   for(int j=-1;j<=1;j++){
  //     vec2 off = vec2(i,j)/u_rez.xy;
  //     vec2 ref = uv.xy + off.xy;
  //     if(uv.xy != ref.xy){
  //       vec4 mycol = texture2D(tex0,ref);
  //       float val = col.z-mycol.z;
  //       //float val2 = mix(val1,val2,sin1);
  //       off = off * val;
  //       dir = dir + off;
  //       cnt = cnt +1.0;
  //     }
  //   }
  // }
  //
  // dir = dir/cnt;

  // vec4 tex = texture2D(tex0,uv.xy+dir.xy*-.5);

  // tex.xyz = clamp(tex.xyz - vec3(decay),vec3(0.0),vec3(1.0)); //trail off

  ////////////////////////


  gl_FragColor = vec4(col.xyz,1.0);

}
