import { fakerEN_IN as faker } from "@faker-js/faker";

const RECORDS_PER_RESOURCE = 20;

/**
 * Field name patterns mapped to contextually appropriate faker generators.
 * Checked in order — first match wins.
 * @type {Array<[RegExp, () => string | number]>}
 */
const FIELD_GENERATORS = [
  // Names
  [/^(first.?name)$/i, () => faker.person.firstName()],
  [/^(last.?name|surname)$/i, () => faker.person.lastName()],
  [/^(full.?name|name|student.?name|user.?name|author|teacher)$/i, () => faker.person.fullName()],
  [/^(username|login|handle)$/i, () => faker.internet.username()],

  // Contact
  [/^(email|e.?mail)$/i, () => faker.internet.email()],
  [/^(phone|mobile|cell|telephone|contact)$/i, () => faker.phone.number()],

  // Location
  [/^(address|street)$/i, () => faker.location.streetAddress()],
  [/^(city|town)$/i, () => faker.location.city()],
  [/^(state|province|region)$/i, () => faker.location.state()],
  [/^(country)$/i, () => faker.location.country()],
  [/^(zip|zip.?code|postal|postal.?code|pincode)$/i, () => faker.location.zipCode()],

  // Education
  [/^(grade|letter.?grade)$/i, () => faker.helpers.arrayElement(["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"])],
  [/^(class|section|division)$/i, () => faker.helpers.arrayElement(["1A", "2B", "3C", "4A", "5B", "6C", "7A", "8B", "9A", "10B", "11A", "12B"])],
  [/^(subject|course)$/i, () => faker.helpers.arrayElement(["Math", "Science", "English", "History", "Physics", "Chemistry", "Biology", "Geography", "Computer Science", "Art"])],
  [/^(department|dept)$/i, () => faker.commerce.department()],
  [/^(school|university|college|institution)$/i, () => faker.company.name() + " School"],

  // Scores / attendance
  [/^(marks|score|points|percentage|percent)$/i, () => faker.number.int({ min: 30, max: 100 })],
  [/^(attendance)$/i, () => faker.number.int({ min: 60, max: 100 }) + "%"],
  [/^(roll.?no|roll.?number|student.?id|reg.?no|enrollment)$/i, () => faker.number.int({ min: 1001, max: 9999 })],

  // Dates / times
  [/^(date|created.?at|updated.?at|timestamp|dob|birth.?date|date.?of.?birth)$/i, () => faker.date.past({ years: 5 }).toISOString().split("T")[0]],
  [/^(year)$/i, () => faker.number.int({ min: 2018, max: 2026 })],

  // Commerce
  [/^(price|cost|amount|salary|fee|budget)$/i, () => parseFloat(faker.commerce.price({ min: 10, max: 10000 }))],
  [/^(product|item|product.?name)$/i, () => faker.commerce.productName()],
  [/^(category|type)$/i, () => faker.commerce.department()],
  [/^(company|organization|org|employer)$/i, () => faker.company.name()],

  // Web / tech
  [/^(url|website|link|homepage)$/i, () => faker.internet.url()],
  [/^(avatar|image|photo|picture|img)$/i, () => faker.image.avatar()],
  [/^(ip|ip.?address)$/i, () => faker.internet.ip()],
  [/^(password)$/i, () => faker.internet.password()],

  // Content
  [/^(title|heading|headline)$/i, () => faker.lorem.words(3)],
  [/^(description|bio|about|summary|overview)$/i, () => faker.lorem.sentence()],
  [/^(content|body|text|comment|review|message|note)$/i, () => faker.lorem.paragraph()],

  // Status
  [/^(status)$/i, () => faker.helpers.arrayElement(["active", "inactive", "pending", "completed", "cancelled"])],
  [/^(gender|sex)$/i, () => faker.helpers.arrayElement(["Male", "Female", "Non-binary"])],
  [/^(role)$/i, () => faker.helpers.arrayElement(["admin", "user", "moderator", "editor", "viewer"])],
  [/^(color|colour)$/i, () => faker.color.human()],

  // Boolean-ish
  [/^(active|verified|published|completed|approved)$/i, () => faker.datatype.boolean()],

  // Identifiers
  [/^(id|uuid)$/i, () => faker.string.uuid().slice(0, 8)],
  [/^(age)$/i, () => faker.number.int({ min: 5, max: 80 })],
];

/**
 * Generate a fake value based on the field name and type.
 * First tries to match the field name to a contextual generator,
 * then falls back to type-based generation.
 * @param {string} fieldName
 * @param {string} type - one of: "string", "number", "email", "text"
 * @returns {string | number | boolean}
 */
function generateValue(fieldName, type) {
  // Try field-name-based generation first
  const normalizedName = fieldName.toLowerCase().replace(/[_\s]+/g, "");
  for (const [pattern, generator] of FIELD_GENERATORS) {
    if (pattern.test(fieldName) || pattern.test(normalizedName)) {
      return generator();
    }
  }

  // Fall back to type-based generation
  switch (type) {
    case "string":
      return faker.word.words({ count: { min: 1, max: 3 } });
    case "number":
      return faker.number.int({ min: 1, max: 1000 });
    case "email":
      return faker.internet.email();
    case "text":
      return faker.lorem.sentence();
    default:
      return faker.word.words(1);
  }
}

/**
 * Generate fake data for all resources in the schema.
 * @param {Record<string, Record<string, string>>} schema
 * @returns {Record<string, Array<Record<string, unknown>>>}
 */
export function generateFakeData(schema) {
  const data = {};

  for (const [resource, fields] of Object.entries(schema)) {
    data[resource] = [];

    for (let i = 0; i < RECORDS_PER_RESOURCE; i++) {
      const record = { id: i + 1 };

      for (const [field, type] of Object.entries(fields)) {
        record[field] = generateValue(field, type);
      }

      data[resource].push(record);
    }
  }

  return data;
}

