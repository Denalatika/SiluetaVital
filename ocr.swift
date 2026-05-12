import Cocoa
import Vision

func recognizeText(in imagePath: String) -> String {
    let url = URL(fileURLWithPath: imagePath)
    guard let image = NSImage(contentsOf: url),
          let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        return ""
    }

    var recognizedText = ""
    let request = VNRecognizeTextRequest { request, error in
        guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
        
        // Tomamos el primer bloque de texto más grande/confiable, o los juntamos
        // Para nombres de producto, a menudo son la primera o segunda palabra grande
        for observation in observations {
            if let topCandidate = observation.topCandidates(1).first {
                recognizedText += topCandidate.string + " "
            }
        }
    }
    
    // Configuración para mayor precisión
    request.recognitionLevel = .accurate
    // request.recognitionLanguages = ["es-MX", "en-US"]

    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try? handler.perform([request])

    return recognizedText.trimmingCharacters(in: .whitespacesAndNewlines)
}

let args = CommandLine.arguments
if args.count > 1 {
    let path = args[1]
    let text = recognizeText(in: path)
    print(text)
}
