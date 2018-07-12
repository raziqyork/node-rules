# node-rules
Experimental rules evaluation engine, written in nodejs. 
Ported from custom, deprecated C# engine (not yet full feature parity).


# Expression types
There are 4 types of Rule expressions:

- Compound: Evaluates to True or False based on the evaluations of an array of child expression (e.g. AND and OR).
- Unary: Transforms the evaluations of a single child expression (e.g. NOT).
- Property: Evaluates to True or False based on a particular comparison operation applied to a property of the source model (e.g. Equals or Contains).
-Loop: Evaluates to True or False based on the evaluation of each item in the object Collection property (e.g. Any, All, and None).

# Compound expressions
## And
Returns True if all child expressions evaluate to True.

Example:
{
  "and": [
    {
      "equals": {
        "propertyName": "extra_props.prod.productCategory",
        "value": "cream"
      }
    },
    {
      "greaterThanOrEqualTo": {
        "propertyName": "extra_props.prod.dates.endDate",
        "dateTimeValue": "2016-03-04"
      }
    }
  ]
}
## Or
Returns True if at least 1 child expression evaluates to True.

Example:
{
  "or": [
    {
      "equals": {
        "propertyName": "extra_props.prod.productCategory",
        "value": "cream"
      }
    },
    {
      "and": [
        {
          "equals": {
            "propertyName": "extra_props.prod.productGroup",
            "value": "talc"
          }
        },
        {
          "greaterThanOrEqualTo": {
            "propertyName": "extra_props.prod.dates.endDate",
            "dateTimeValue": "2016-03-04"
          }
        }
      ]
    }
  ]
}
# Unary expressions
## Not
Returns the inverted result of the child expression.

Example:
{
  "not": {
     "contains": {
       "propertyName": "extra_props.prod.productGroup",
       "value": "talc"
     }
  }
}
# Property expressions
## Equals
Returns True if the value of the model property named propertyName is equal to the given value, or the value resolved from the parameter or model reference.

Example:
{
  "equals": {
    "propertyName": "extra_props.prod.productGroup",
    "value": "talc"
  }
}
## NotEquals
Returns True if the value of the model property named propertyName is not equal to the given value, or the value resolved from the parameter or model reference.

Example:
{
  "notEquals": {
    "propertyName": "extra_props.prod.productGroup",
    "value": "talc"
  }
}
## Contains (string contains)
Returns True if the value of the model string property named propertyName contains the given string value, or the string value resolved from the parameter or model reference.

Example:
{
  "contains": {
    "propertyName": "extra_props.prod.productCategory",
    "value": "cream"
  }
}
## Contains (array contains)
Returns True if the value of the model collection property named propertyName contains and item with the given value, or the value resolved from the parameter or model reference.

Example:
{
  "contains": {
    "propertyName": "extra_props.prod.terms",
    "value": "FML"
  }
}
## LessThan
Returns True if the value of the model property named propertyName is less than the given value, or the value resolved from the parameter or model reference.

Example:
{
  "lessThan": {
    "propertyName": "extra_props.prod.dates.startDate",
    "value": "2017-03-04"
  }
}
## LessThanOrEqualTo
Returns True if the value of the model property named propertyName is less than or equal to the given value, or the value resolved from the parameter or model reference.

Example:
{
  "lessThanOrEqualTo": {
    "propertyName": "extra_props.prod.dates.startDate",
    "value": "2017-03-04"
  }
}
## GreaterThan
Returns True if the value of the model property named propertyName is greater than the given value, or the value resolved from the parameter or model reference.

Example:
{
  "greaterThan": {
    "propertyName": "extra_props.prod.dates.endDate",
    "value": "2017-10-04"
  }
}
## GreaterThanOrEqualTo
Returns True if the value of the model property named propertyName is greater than or equal to the given value, or the value resolved from the parameter or model reference.

Example:
{
  "greaterThanOrEqualTo": {
    "propertyName": "extra_props.prod.dates.endDate",
    "value": "2017-10-04"
  }
}
## Matches
Returns True if the value of the model string property named propertyName matches the Regex pattern in the given string value, or the string value resolved from the parameter or model reference.

Example:
{
  "contains": {
    "propertyName": "extra_props.prod.productCategory",
    "value": "^cream-.*$"
  }
}
# Loop expressions
## Any
Loops through the items in the model collection property named propertName and then evaluates nested Rule expression. Returns True if ANY items in the collection evaluate to True against the supplied rule.

Example:
{
  "any": {
    "propertyName": "acme.Data.Orders",
    "token": "$item",
    "predicate": {
      "and": [
        {
          "contains": {
            "propertyName": "prod_data.availabilityZones",
            "value": { "propertyName": "$item.destination" } /* each Contract referenced by $item token */
          }
        },
        {
          "equals": {
            "propertyName": "$item.productGroup",
            "value": { "propertyName": "prod_data.productGroup" }
          }
        }
      ]
    }
  }
}
## All
Loops through the items in the model collection property named propertName and then evaluates nested Rule expression. Returns True if ALL items in the collection evaluate to True against the supplied rule.

Example:
{
  "all": {
    "propertyName": "acme.Data.Orders",
    "token": "$item",
    "predicate": {
      "and": [
        {
          "contains": {
            "propertyName": "prod_data.availabilityZones",
            "value": { "propertyName": "$item.destination" } /* each Contract referenced by $item token */
          }
        },
        {
          "equals": {
            "propertyName": "$item.productGroup",
            "value": { "propertyName": "prod_data.productGroup" }
          }
        }
      ]
    }
  }
}
## None
Loops through the items in the model collection property named propertName and then evaluates nested Rule expression. Returns True if NO items in the collection evaluate to True against the supplied rule.

Example:
{
  "none": {
    "propertyName": "acme.Data.Orders",
    "token": "$item",
    "predicate": {
      "and": [
        {
          "contains": {
            "propertyName": "prod_data.availabilityZones",
            "value": { "propertyName": "$item.destination" } /* each Contract referenced by $item token */
          }
        },
        {
          "equals": {
            "propertyName": "$item.productGroup",
            "value": { "propertyName": "prod_data.productGroup" }
          }
        }
      ]
    }
  }
}
## Parameter values
Parameters allow for Rule templates to be specified (used primarily in Workflow Definitions) and then, before evaluation of the Rules, the parameters are bound - replaced with actual values from a parameters dictionary.

Example:
{
  "greaterThanOrEqualTo": {
    "propertyName": "extra_props.prod.dates.endDate",
    "value": {
       "parameter": "paraValue"
    }
  }
}
 
/* before evaluations, bind Rule using following dictionary */
{
   "paraValue" : "2017-10-04"
}
## References values
References allow for Property expression values to be derived from the values of other properties in the model.

Example:
{
  "contains": {
    "propertyName": "extra_props.prod.destinations",
    "value": {
       "propertyName": "extra_props.buyer.destination"
    }
  }
}
# Helpers
Some of the expressions (e.g array Contains) require special handling, so we have a Utils object that can be referenced in the expressions. 

## Utils.Delay
Utils.Delay(int) is a method in this helper class which will delay the evaluation for the specified time (in ms) and then return a 0. To add a delay into a Rule tree (e.g. for testing), the following expression can be added where it'll definitely be applied.

Example:
{
  "and": [
    {
      "equals": {
        "propertyName": "Utils.Delay(3000)",
        "value": 0
      }
    },
    {
      "contains": {
        "propertyName": "prod.Name",
        "value": "Lorem ipsum"
      }
    }
  ]
}
## UtcNow
Utils.Now is a property in the expression context state object which returns: DateTimeOffset.UtcNow.

Example:
{
  "greaterThanOrEqualTo": {
    "propertyName": "UtcNow",
    "value": {
      "propertyName": "$item.DateFrom"
    }
  }
}
## UtcToday
Utils.Today is a property in the expression context state object which returns: new DateTimeOffset(DateTime.UtcNow.Date).

Example:
{
  "lessThan": {
    "propertyName": "$item.DateTo",
    "value": {
      "propertyName": "UtcToday"
    }
  }
}

# scrap
```
"compilerOptions": {
        "module": "commonjs",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "declaration": false,
        "noImplicitAny": false,
        "removeComments": true,
        "noLib": false,
        "preserveConstEnums": true,
        "suppressImplicitAnyIndexErrors": true
    },

```