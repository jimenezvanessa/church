export function generateSlides(lyrics: string): string[] {
  const rawLines = lyrics.split('\n');
  const slides: string[] = [];
  const markerPattern = /^(Verse \d+|Verse|Chorus|Bridge|Intro|Outro|Pre-Chorus|Interlude)$/i;
  
  let currentSlide: string[] = [];
  
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      if (currentSlide.length > 0) {
        if (currentSlide.length > 3) {
          const remainder = currentSlide.length % 3;
          if (remainder !== 0 && remainder <= 2) {
            const mainSlides = currentSlide.length - remainder;
            for (let j = 0; j < mainSlides; j += 3) {
              slides.push(currentSlide.slice(j, j + 3).join('\n'));
            }
            const lastIdx = slides.length - 1;
            slides[lastIdx] = slides[lastIdx] + '\n' + currentSlide.slice(mainSlides).join('\n');
          } else {
            for (let j = 0; j < currentSlide.length; j += 3) {
              slides.push(currentSlide.slice(j, j + 3).join('\n'));
            }
          }
        } else {
          slides.push(currentSlide.join('\n'));
        }
        currentSlide = [];
      }
      continue;
    }
    
    if (markerPattern.test(trimmedLine)) {
      if (currentSlide.length > 0) {
        if (currentSlide.length > 3) {
          const remainder = currentSlide.length % 3;
          if (remainder !== 0 && remainder <= 2) {
            const mainSlides = currentSlide.length - remainder;
            for (let j = 0; j < mainSlides; j += 3) {
              slides.push(currentSlide.slice(j, j + 3).join('\n'));
            }
            const lastIdx = slides.length - 1;
            slides[lastIdx] = slides[lastIdx] + '\n' + currentSlide.slice(mainSlides).join('\n');
          } else {
            for (let j = 0; j < currentSlide.length; j += 3) {
              slides.push(currentSlide.slice(j, j + 3).join('\n'));
            }
          }
        } else {
          slides.push(currentSlide.join('\n'));
        }
        currentSlide = [];
      }
      currentSlide.push(trimmedLine);
    } else if (currentSlide.length > 0 || trimmedLine !== '') {
      currentSlide.push(trimmedLine);
    }
  }
  
if (currentSlide.length > 0) {
    if (currentSlide.length > 3) {
      const remainder = currentSlide.length % 3;
      if (remainder !== 0 && remainder <= 2) {
        const mainSlides = currentSlide.length - remainder;
        for (let j = 0; j < mainSlides; j += 3) {
          slides.push(currentSlide.slice(j, j + 3).join('\n'));
        }
        const lastIdx = slides.length - 1;
        slides[lastIdx] = slides[lastIdx] + '\n' + currentSlide.slice(mainSlides).join('\n');
      } else {
        for (let j = 0; j < currentSlide.length; j += 3) {
          slides.push(currentSlide.slice(j, j + 3).join('\n'));
        }
      }
    } else {
      slides.push(currentSlide.join('\n'));
    }
  }
  
  return slides.filter(slide => slide.length > 0);
}