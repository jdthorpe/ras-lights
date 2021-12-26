"""
"""
# pylint: disable=invalid-name
from aiohttp import web
import yaml
from json.decoder import JSONDecodeError
from jsonschema import validate
from jsonschema.exceptions import ValidationError
import os.path

from ws2812 import start, set_color_s, random_colors, turn_off

@web.middleware
async def debug_middleware(request, handler):
    try:
        return await handler(request)
    except web.HTTPException as ex:
        print("Error {} in request for {}".format(ex.status,request.path))
        raise
    except:
        print("Something went wront in request for {}".format(request.path))
        raise




def main():
    """
    start the server
    """
    start()
    with open(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "schema.yaml")
    ) as f:
        schema = yaml.safe_load(f)

    async def get_turn_off(request):
        """
        set random colors
        """
        print("turn off")
        turn_off()
        return web.Response(text="OK")

    async def get_random(request):
        """
        set random colors
        """
        print("random colors")
        random_colors()
        return web.Response(text="OK")

    async def post_color(request):
        """
        set colors via json payload
        """
        try:
            data = await request.json()
        except JSONDecodeError:
            raise web.HTTPBadRequest(reason="Payload not formatted as JSON")

        try:
            validate(data, schema)
        except ValidationError:
            raise web.HTTPBadRequest(reason="Payload does not meet the schema")

        print("set colors: {}".format(data))
        set_color_s(data)
        return web.Response(text="OK")

    app = web.Application()
    app.middlewares.append(debug_middleware)
    app.add_routes(
        [
            web.get("/random", get_random), 
        web.get("/off", get_turn_off), 
        web.post("/set-colors", post_color)]
    )
    web.run_app(app, port=4444)


if __name__ == "__main__":
    main()
