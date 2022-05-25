#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_rez;
uniform sampler2D tex0;

void main(){

  vec2 uv = gl_FragCoord.xy/u_rez.xy;
  uv.y = 1.0 - uv.y;

  vec4 tex = texture2D(tex0,uv);

  const float pi = 6.28318530718; // Pi*2

  const float directions = 16.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
  const float quality = 4.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
  const float size = 2.0; //
  vec2 radius = size/u_rez.xy;
  for( float d=0.0; d<pi; d+=pi/directions){
		for(float i=1.0/quality; i<=1.0; i+=1.0/quality)
        {
			tex += texture2D( tex0, uv+vec2(cos(d),sin(d))*radius*i);
        }
    }
  tex /= (quality * directions+.95);

  gl_FragColor = tex;
}
