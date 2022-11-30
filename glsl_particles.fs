// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec2 pt;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    float totd = 0.0;
    for(int i = 0; i<15;i++){
        pt.x = noise(vec2(float(i)+.234,524.54+float(i)*15.32+u_time*.5*(random(vec2(i))+1.0)));
        pt.y = noise(vec2(float(i)*234.2+432.624,234.223+float(i)*343.0+u_time*.5*(random(vec2(i))+1.0)));
        // pt.x = .2;
        // pt.y = .5;
        float d = distance(st,pt);
        d = smoothstep(0.0,.1,d);
        d = 1.-d;
        totd = mix(totd,1.0,d);
    }
    
    vec3 color = vec3(0.);
    //color = vec3(st.x,st.y,abs(sin(u_time)));
	color.x = totd;
    gl_FragColor = vec4(color,1.0);
}



