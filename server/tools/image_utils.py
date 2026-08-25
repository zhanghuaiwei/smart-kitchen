"""图片处理基础工具"""
import base64
import io

from config import get_settings


def decode_base64_image(image_base64: str) -> bytes:
    """解码 base64 图片 (自动去除 data:image/xxx;base64, 前缀)"""
    stripped = image_base64.strip()
    if stripped.startswith("data:") and "," in stripped[:64]:
        stripped = stripped.split(",", 1)[1]
    return base64.b64decode(stripped)


def compress_image(image_bytes: bytes, max_side: int = 1024, quality: int = 85) -> bytes:
    """压缩图片: 限制最长边 + JPEG 重编码

    调用视觉大模型前建议先压缩, 可显著降低 token 消耗。
    """
    from PIL import Image

    img = Image.open(io.BytesIO(image_bytes))
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    if max(w, h) > max_side:
        scale = max_side / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=quality)
    return buf.getvalue()


def check_image_size(image_bytes: bytes) -> None:
    """校验图片大小上限, 超限抛出 ValueError"""
    limit_mb = get_settings().max_image_size_mb
    if len(image_bytes) > limit_mb * 1024 * 1024:
        raise ValueError(f"图片超过大小上限 {limit_mb}MB")
