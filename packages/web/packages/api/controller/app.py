"""
A minimal examle of a worker which (1) recieves work requests via http
(aiohttp) executes database fetch / upate asynchronously in the main process,
and does work in a pool of sub-process.
"""
# pylint: disable=invalid-name
from aiohttp import web
import yaml
from json.decoder import JSONDecodeError
from jsonschema import validate
from jsonschema.exceptions import ValidationError
import os.path

# from ws2812 import start, set_color_s, random_colors


def main():
    """
    start the server
    """
    # start()
    with open(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "schema.yaml")
    ) as f:
        schema = yaml.safe_load(f)

    async def get_random(request):
        """
        set random colors
        """
        # random_colors()
        print("random colors")
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
        return web.Response(text="OK")
        # set_color_s(data)

    app = web.Application()
    app.add_routes(
        [web.get("/random", get_random), web.post("/set-colors", post_color)]
    )
    web.run_app(app, port=4444)


if __name__ == "__main__":
    main()