#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_rez;
uniform sampler2D tex0;

void main(){
  vec2 uv = gl_FragCoord.xy/u_rez.xy;
  uv.y = 1.0 - uv.y;

  // vec4 col = vec4(0,0,0,0);
  // float cnt = 0.0;
  // for(int i=-1;i<=1;i++){
  //   for(int j=-1;j<=1;j++){
  //     vec2 off = vec2(i,j)/u_rez.xy;
  //     vec2 ref = uv.xy + off.xy;
  //     vec4 mycol = texture2D(tex0,ref);
  //     col += mycol;
  //     cnt = cnt +1.0;
  //   }
  // }
  //
  // col=col/cnt;

  vec4 col = texture2D(tex0,uv);

  //vec4 tex = texture2D(tex0,uv);
  // float m = smoothstep(.5,.7,col.x);
  col.xyz = vec3(smoothstep(0.1,.8,col.x));

  float t = .15;
  float b1 = .6;
  float b2 = .3;
  float edge = smoothstep(b1+t,b1,col.x)*smoothstep(b2-t,b2,col.x);
  //col.xyz = vec3(pow(col.x,2.0));
  col.xyz = vec3(1.0) - col.xyz;



  //col.xyz = mix(vec3(.96),vec3(0.2,1.0,.3),1.-col.x);
  //col.xyz = mix(col.xyz,vec3(0),edge);
  // col.xyz = mix(vec3(.825,.99,.205),vec3(.71,.76,.79),pow(col.x,3.0));
  col.xyz = mix(vec3(0.0,.95,0.),vec3(.75),pow(col.x,3.0));
  // col.xyz = mix(col.xyz,vec3(0),m);
  //col.xyz = vec3(1.-edge);
  //vec3 col = vec3(uv.y,0.0,0.0);

  gl_FragColor = vec4(col.xyz,1.0);

}
