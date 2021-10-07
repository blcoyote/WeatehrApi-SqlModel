from pydantic import BaseModel, validator


# testing using validation decorators as automatic value converters.
class TestClass(BaseModel):
    value: int

    @validator('value')
    def convert(cls, v: int):
        v = v + 3
        return v


testclass = TestClass(value=2)

print(testclass.value)
# Output: 5, success

v = 72

v = (v - 32) * 5.0/9.0

print(v)
