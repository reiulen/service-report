import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Box, Button, Image } from "@chakra-ui/react";
import { BiSave, BiTrash } from "react-icons/bi";
import { useFormStepStore } from "@/stores/formSteps/stores";

interface SignaturePadProps {
  onClear: () => void;
  onSave: (signature: string) => void;
}

const SignaturePad = ({ onClear, onSave }: SignaturePadProps) => {
  const { data, setData } = useFormStepStore();
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleEnd = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL("image/png");
      onSave(signatureData);
      setData({ ...data, signature: signatureData });
    }
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
    onClear();
    setData({ ...data, signature: "" });
  };

  return (
    <Box>
      <Box border="1px solid #ccc" p={4} borderRadius="md">
        {data?.signature ? (
          <Box>
            <Image 
            width={700}
            height={250}
            src={data?.signature} 
            alt="Tanda Tangan" 
            />
          </Box>
        ) : (
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            onEnd={handleEnd}
            canvasProps={{ width: 700, height: 250, className: "sigCanvas" }}
          />
        )}
      </Box>

      <Box mt={3} display="flex" gap={2} justifyContent={"end"}>
        <Button
          onClick={clearSignature}
          colorPalette="red"
          size="sm"
          disabled={!data?.signature}
        >
          <BiTrash />
          Bersihkan
        </Button>
      </Box>
    </Box>
  );
};

export default SignaturePad;
