package com.rohkeymon.SpringBootAPI.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.rohkeymon.SpringBootAPI.model.Decklists;
import com.rohkeymon.SpringBootAPI.repo.DecklistsRepo;

@RestController
@RequestMapping(
        path = {"api"}
)
public class MainController {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    DecklistsRepo decklistsRepo;

    @GetMapping(
            path = {"test"}
    )
    String test() {
        return "It works!";
    }

    @GetMapping({"alldata"})
    List<Decklists> alldata() {
        return decklistsRepo.findAll();
    }

    @GetMapping({"decklist"})
    List<Decklists> decklistQueryResult() {return decklistsRepo.decklistQuery();}

    @GetMapping("/decklist/{decklistId}/cards-map")
    public Map<String, Object> getDecklistAsMap(@PathVariable String decklistId) {
        List<Decklists> cards = decklistsRepo.findByDecklistId(decklistId);

        // Transform list to nested object structure
        Map<String, Object> result = new HashMap<>();
        for (Decklists card : cards) {
            Map<String, Integer> cardData = new HashMap<>();
            cardData.put("count", card.getCard_copies());
            result.put(card.getCard_id(), cardData);
        }

        return result;  // Returns: {"base1-6": {"count": 3}, "base1-4": {"count": 2}}
    }

    @PostMapping("add-to-deck")
    public Decklists save(@RequestBody Decklists decklists) {
       return decklistsRepo.save(decklists);
        //TODO: if card copies >=4, send message saying max has been reached.

    }
        //String card_id = body.get("card_id");
        //Cards cards = new Cards(card_id);*/

    @PatchMapping("decrement-copies")
    public Decklists decrement(@RequestBody Decklists decklists) {
        return decklistsRepo.decrement(decklists);
    }

    @DeleteMapping("delete-entry")
    public Decklists deleteEntry(@RequestBody Decklists decklists) {
        return decklistsRepo.deleteEntry(decklists);
    }
}
