import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
} as const

// Image generation
export async function GET() {
  return new ImageResponse((
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f8fafc',
        fontFamily: 'Vazirmatn, system-ui, sans-serif',
        direction: 'rtl',
        textAlign: 'center',
      }}
    >
      {/* Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
        opacity: 0.95,
      }} />
      
      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        color: '#ffffff',
        maxWidth: '1000px',
        padding: '40px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '60px',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '32px' }}>🚀</span>
          </div>
          <div>
            <h1 style={{
              fontSize: '52px',
              fontWeight: 'bold',
              margin: '0',
              letterSpacing: '-1px',
              fontFamily: 'Vazirmatn, system-ui, sans-serif',
            }}>
              بورس {''}
              <span style={{ color: '#86efac' }}>رادار</span>
            </h1>
            <p style={{
              fontSize: '24px',
              margin: '8px 0 0 0',
              opacity: 0.9,
              fontFamily: 'Vazirmatn, system-ui, sans-serif',
            }}>
              تحلیل بنیادی بورس تهران
            </p>
          </div>
        </div>

        {/* Features */}
        <div style={{
          display: 'flex',
          gap: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '15px 25px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
              P/E آینده‌نگر
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              بر اساس ۳ ماه آینده
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '15px 25px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
              فروش ماهانه
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              از کدال و TSETMC
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '15px 25px',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '5px' }}>
              حاشیه سود واقعی
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              تحلیل بنیادی دقیق
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          paddingTop: '30px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '18px',
          opacity: 0.8,
          fontFamily: 'Vazirmatn, system-ui, sans-serif',
        }}>
          bours-radar.com
        </div>
      </div>
    </div>
  ), size)
}
