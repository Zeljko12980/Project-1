using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
namespace API.utils
{
public class CleanJsonConverter : JsonConverter
{
    public override bool CanConvert(Type objectType)
    {
        return objectType == typeof(object); // You can extend this to specific types if needed
    }

    public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
    {
        JObject jObject = JObject.FromObject(value, serializer);

        // Remove properties that start with '$'
        foreach (var property in jObject.Properties().ToList())
        {
            if (property.Name.StartsWith("$"))
            {
                property.Remove();
            }
        }

        jObject.WriteTo(writer);
    }

    public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
    {
        return JToken.ReadFrom(reader); // If you want to keep deserialization as-is, modify as needed.
    }
}
}