### Framwork Used:
Nest JS: which enables enough flexibility in integrating typescript with node JS

### Architecture Used:
Onion Architecture: 
> **Layer 1** -Api Controller : Which handles http request and response
> **Layer 2** -Services : where the actual logic are implemented
> **Layer 3** -Modules : where the services and controllers are registered.
> In-MemoryCache: Used as the storage for rate limiting trackers

### How does it work:
> It accepts the date Input as a query parameter and returns the age.
> Date format accepted: dd/mm/yyyy
> Rate Limiting Logic: returns 429 for any 3 request within a second
