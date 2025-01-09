using System.Text.Json;
using System.Text.Json.Serialization;
namespace API.utils
{
public class RemoveJsonIdsConverter : JsonConverter<JsonElement>
{
    public override JsonElement Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var doc = JsonDocument.ParseValue(ref reader);
        return doc.RootElement;
    }

    public override void Write(Utf8JsonWriter writer, JsonElement value, JsonSerializerOptions options)
    {
        // Recursively clean the object of unwanted properties
        CleanJson(writer, value);
    }

    private void CleanJson(Utf8JsonWriter writer, JsonElement element)
    {
        writer.WriteStartObject();
        foreach (var property in element.EnumerateObject())
        {
            // Skip properties like $id or $ref
            if (property.Name.StartsWith("$"))
                continue;

            writer.WriteStartObject();
            writer.WritePropertyName(property.Name);
            if (property.Value.ValueKind == JsonValueKind.Object)
            {
                CleanJson(writer, property.Value); // Recurse if the value is an object
            }
            else
            {
                property.Value.WriteTo(writer); // Write the actual value if not an object
            }
            writer.WriteEndObject();
        }
        writer.WriteEndObject();
    }
}
}