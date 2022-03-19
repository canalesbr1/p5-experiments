#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_rez; //recieve rez from sketch.js
uniform sampler2D tex0; //recieve tex0 from sketch.js
uniform float mytime; //recieve tex0 from sketch.js

void main(){
  vec2 uv = gl_FragCoord.xy/u_rez.xy; //normalize uv coords;
  uv.y = 1.0 - uv.y;

  vec4 coltot = vec4(0,0,0,0);
  float cnt = 0.0;
  for(int i=-2;i<=2;i++){
    for(int j=-2;j<=2;j++){
      vec2 off = vec2(i,j)/u_rez.xy;
      vec2 ref = uv.xy + off.xy;
      vec4 mycol = texture2D(tex0,ref);
      coltot += mycol;
      //float val2 = mix(val1,val2,sin1);
      cnt = cnt +1.0;
    }
  }
  coltot=coltot/cnt;
  vec4 tex = texture2D(tex0,uv);
  vec3 col = mix(coltot.xyz,tex.xyz,0.1);

  gl_FragColor = vec4(col.xyz,1.0);

}

//float sin1 = sin(uv.y*25.0 + mytime*.2);

// vec2 dir = vec2(0.0,0.0);
// vec4 col = texture2D(tex0,uv);
// float cnt = 0.0;

// for(int i=-2;i<=2;i++){
//   for(int j=-2;j<=2;j++){
//     vec2 off = vec2(i,j)/u_rez.xy;
//     vec2 ref = uv.xy + off.xy;
//     if(uv.xy != ref.xy){
//       vec4 mycol = texture2D(tex0,ref);
//       mycol = vec4(mycol.xyz,1.0);
//       float val = (col.x+col.y+col.z)-(mycol.x+mycol.y+mycol.z);
//       //float val2 = mix(val1,val2,sin1);
//       off = off * val;
//       dir = dir + off;
//       cnt = cnt +1.0;
//     }
//   }
// }
// dir = dir/cnt;
// dir*=.1;

// vec3 dircross = cross(vec3(dir.x,0.0,dir.y),vec3(0.0,1.0,0.0));
// dir = vec2(dircross.x,dircross.z)*2.0;
// vec2 tar = uv.xy + dir.xy;
// vec4 tex = texture2D(tex0,tar);
//vec2 tar = vec2(uv);
//tar.x += sin1*.0005;
//tar.y += sin1*-.0005;
//vec4 tex = texture2D(tex0,tar);
//vec3 col = vec3(tex.xyz);
